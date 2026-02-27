"use client";

import React, { useState } from "react";
import FormInput from "./_components/FormInput";
import PreviewResult from "./_components/PreviewResult";
import axios from "axios";
import { useAuthContext } from "@/app/provider";

type FormDataType = {
  file?: File;
  description: string;
  size: string;
  imageUrl?: string;
};

function ProductImages() {
  const [formData, setFormData] = useState<FormDataType>({
    description: "",
    size: "",
  });

  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  // Handle Input Change
  const onHandleInputChange = (field: keyof FormDataType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate Image
  const OnGenerate = async () => {
    // Validate file
    if (!formData.file) {
      alert("Please upload a product image");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Append only if file exists
      formDataToSend.append("file", formData.file);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("userEmail", user?.email ?? "");

      const result = await axios.post(
        "/api/generate-product-image",
        formDataToSend
      );

      console.log("API Response:", result.data);

      // Store generated image URL in state
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.data,
      }));
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Something went wrong while generating the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-3">
        AI Product Images
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Form */}
        <div>
          <FormInput
            onHandleInputChange={onHandleInputChange}
            OnGenerate={OnGenerate}
            loading={loading}
          />
        </div>

        {/* Right Side - Preview */}
        <div className="md:col-span-2">
          <PreviewResult   />
        </div>
      </div>
    </div>
  );
}

export default ProductImages;


