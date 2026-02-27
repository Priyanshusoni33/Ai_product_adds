import { imagekit } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { clientOpenAi } from "@/lib/openai";

const PROMPT = `Create a vibrant product showcase image featuring a uploaded image in the center, surrounded by dynamic splashes of liquid or relevant material effects that enhance the product’s appeal. Use a clean, colorful background to make the product stand out. Include ingredients, theme elements, or contextual props around the product to add context and visual interest. Ensure the product is sharp and in focus, with motion and energy conveyed through lighting and splash effects. The overall composition should look professional, high-resolution, and suitable for social media advertising.`


export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const description = formData.get("description");
    const size = formData.get("size");
    const userEmail = formData?.get('userEmail');

    // Save to Database
    const docId = Date.now().toString();
    await setDoc(doc(db, "user-ads", Date.now().toString()), {
        userEmail:userEmail,
        status:'pending',
        description: description, 
        size: size,
});

    // Upload Product Image
    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");

    const imageKitRef = await imagekit.upload({
        file: base64File,
        fileName: Date.now() + ".png",
        isPublished: true,
    });

    console.log(imageKitRef.url);


    //generate product image prompt using chatgpt

    const response = await clientOpenAi.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: PROMPT,
                    },
                    {
                        type: "input_image",
                        image_url: imageKitRef.url,
                    },
                ],
            },
        ],
    });

    const textOutput = response.output_text?.trim();
    let json = JSON.parse(textOutput);

    // Generate Product Image
    const ImageResponse = await clientOpenAi.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
                    // @ts-ignore
                    { type: "input_text", text: textOutput?.textToImage },
                    // @ts-ignore
                    { type: "input_image", image_url: imageKitRef.url },
                ],
            },
        ],
        tools: [{ type: "image_generation" }],
    });
    console.log(ImageResponse.output);
    // Extract base64 image
    const imageData = ImageResponse.output
        ?.filter((item: any) => item.type === "image_generation_call")
        ?.map((item: any) => item.result);

    const generatedImage = imageData?.[0];

    
    // Upload Generated Image to ImageKit

    const uploadResult = await imagekit.upload({
        file: `data:image/png;base64,${generatedImage}`,
        fileName: `generated-${Date.now()}.png`,
        isPublished: true,
    });

    //update doc
    await updateDoc(doc(db,'user-ads',docId),{
        finalProductImageUrl: uploadResult?.url,
        productImageUrl: imageKitRef.url,
        status:'completed'
    })



    return NextResponse.json(uploadResult.url);
  } 