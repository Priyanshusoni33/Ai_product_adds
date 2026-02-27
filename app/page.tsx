"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "./provider";

export default function Home() {
  const router = useRouter();
  const user = useAuthContext();

  useEffect(() => {
    router.replace("/app");
  }, [router]);

  return <div></div>;
}

