"use client";

import { useAuthContext } from "@/app/provider";
import { db } from "@/configs/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

type PreviewProduct = {
    id: string;
    finalProductImageUrl: string;
    productImageUrl: string;
    description: string;
    size: string;
    status: string;
};

function PreviewResult() {
    const { user } = useAuthContext();
    const [productList, setProductrList] = useState<PreviewProduct[]>([]);

    useEffect(() => {
        if (!user?.email) return;

        console.log("User Email:", user.email);

        const q = query(
            collection(db, "user-ads"),
            where("userEmail", "==", user.email)
        );

        const usSub = onSnapshot(q, (querySnapshot) => {
            console.log("Firestore Snapshot:", querySnapshot);

            const matchedDocs: any = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log("Single Doc Data:", data);

                matchedDocs.push({ id: doc.id, ...data });
            });

            console.log("Matched Docs Array:", matchedDocs);

            setProductrList(matchedDocs);
        });

        return () => usSub();
    }, [user?.email]);

    const DownloadImage = async (imageUrl: string) => {
        console.log("Download URL:", imageUrl);

        try {
            const result = await fetch(imageUrl);
            console.log("Fetch Response:", result);

            const blob = await result.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.setAttribute("download", "generated-image.jpg");

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);

        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <div className="p-5 rounded-2xl border">
            <h2 className="font-bold text-2xl mb-4">Generated Result</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {productList?.map((product) => {
                    console.log("Rendering Product:", product);
                    console.log("Image URL:", product.finalProductImageUrl);

                    return (
                        <div key={product.id}>
                            {product.status === "completed" && product.finalProductImageUrl ? (
                                <div>
                                    <Image
                                        src={product.finalProductImageUrl}
                                        alt={product.id}
                                        width={500}
                                        height={500}
                                        className="w-full h-[250px] object-cover rounded-xl"
                                    />

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    DownloadImage(product.finalProductImageUrl)
                                                }
                                            >
                                                Download
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    window.open(product.finalProductImageUrl, "_blank")
                                                }
                                            >
                                                View
                                            </Button>
                                        </div>

                                        <Button>Animate</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-[250px] flex flex-col items-center justify-center bg-gray-100 rounded-xl">
                                    <Loader2 className="animate-spin mb-2" />
                                    <p className="text-gray-500">Generating...</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PreviewResult;