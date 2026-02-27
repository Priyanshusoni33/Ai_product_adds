"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const AiTools = [
  {
    name: "AI Products Images",
    desc: "Generate high-quality, professional product images using AI.",
    banner: "/product-image.png",
    path: '/creative-ai-tools/product-images'
  },
  {
    name: "AI Products Video",
    desc: "Create engaging product showcase videos using AI tools.",
    banner: "/product-video.png",
    path: '/creative-ai-tools/product-images'

  },
  {
    name: "AI Products With Avatar",
    desc: "Bring your products to life with AI avatars and presenters.",
    banner: "/product-avatar.png",
    path: '/creative-ai-tools/product-images'

  },
];

function AiToolList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {AiTools.map((tool, index) => (
        <div
          key={index}
          className="border rounded-xl p-5 hover:shadow-xl transition cursor-pointer bg-white dark:bg-neutral-900"
        >
          <div className="relative w-full h-40 mb-4">
            <Image
              src={tool.banner}
              alt={tool.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <h2 className="text-lg font-semibold mb-2">
            {tool.name}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tool.desc}
          </p>

          <Link href={tool.path}>
            <button className="mt-auto w-full bg-black text-white py-2 rounded-lg hover:bg-neutral-800 transition">
              Create Now
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default AiToolList;

