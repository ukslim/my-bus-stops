"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BusStops from "./bus-stops";
import { configSchema } from "./schemas";

export default function Home() {
  const [config, setConfig] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("config");
    setConfig(configSchema.parse(JSON.parse(data ?? "[]")));
  }, []);

  return (
    <main className="min-h-screen items-center p-0 sm:p-25 sm:text-base">
      <h1 className="text-3xl font-bold mt-1 sm:mt-4">Buses</h1>
      <BusStops config={config} />
      <Link href="/config" className="text-blue-500">
        Configure / Credits
      </Link>
    </main>
  );
}
