"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;
    router.push("/loc/home");
  }, [router]);

  return null;
}
