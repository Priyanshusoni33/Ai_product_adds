"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2Icon, Sparkles } from "lucide-react";

// const sampleProduct = [
//     '/headphone.png',
//     '/juice-can.png',
//     '/prefume.png',
//     '/burger.png'
// ]

type Props = {
    onHandleInputChange: any,
    OnGenerate: any,
    loading: boolean
}
function FormInput({ onHandleInputChange, OnGenerate, loading }: Props) {
    const [preview, setPreview] = useState<string | null>(null);

    const onFileSelect = (files: FileList | null) => {
        if (!files || files?.length == 0) return;
        const file = files[0];
        if (file.size > 5 * 1024 * 1024) {
            alert('file size greater than 5 mb')
            return;
        }
        onHandleInputChange('file', file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div>

            {/* 1. Upload Product Image */}
            <div>
                <h2 className="font-semibold">
                    1. Upload Product Image
                </h2>

                <div className="mt-3">
                    <label className="border-2 border-dashed rounded-lg p-6 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800">

                        {!preview ? (
                            <div className="flex flex-col items-center justify-center">
                                <ImagePlus className="h-8 w-8 opacity-70" />
                                <h2 className="text-xl mt-2">
                                    Click here to upload
                                </h2>
                                <p className="opacity-45">
                                    Upload image
                                </p>
                            </div>
                        ) : (
                            <div className="relative w-full h-60">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-contain rounded-md"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={(event) => onFileSelect(event.target.files)}
                            className="hidden"
                        />

                    </label>
                </div>
            </div>

            {/* 2. Enter Product Description */}
            <div className="mt-8">
                <h2 className="font-semibold">
                    2. Enter product description
                </h2>

                <textarea
                    placeholder="Tell more about product and how you want to display"
                    className="w-full min-h-[150px] p-3 border rounded-lg mt-2 dark:bg-neutral-800"
                    onChange={(event) => onHandleInputChange('description', event.target.value)}
                />
            </div>

            {/* 3. Select Image Size */}
            <div className="mt-8">
                <h2 className="font-semibold">
                    3. Select Image Size
                </h2>

                <select className="w-full p-3 border rounded-lg mt-2 dark:bg-neutral-800" onChange={(event) => onHandleInputChange('size', event.target.value)}>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                </select>
            </div>

            {/* Generate Button */}
            <div className="mt-8">
                <button
                    disabled={loading}
                    onClick={OnGenerate}
                    className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2Icon className="animate-spin" />
                    ) : (
                        <Sparkles />
                    )}
                    Generate
                </button>
            </div>

        </div>
    );
}

export default FormInput;

