"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { migrateOldConfig } from "../utils/config";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    migrateOldConfig();
    router.push("/loc/home");
  }, [router]);

  return null;
}
