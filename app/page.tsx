"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BusStop from "./bus-stop";
import { configSchema } from "./schemas";

export default function Home() {
  const [config, setConfig] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("config");
    setConfig(configSchema.parse(JSON.parse(data ?? "[]")));
  }, []);

  // Every minute, change this value to trigger the useEffect in BusStop
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="min-h-screen items-center p-0 sm:p-25 sm:text-base">
      <h1 className="text-3xl font-bold mt-1 sm:mt-4">Buses</h1>
      {config.length === 0 ? <div>No bus stops configured</div> : null}
      <div className="w-full text-sm sm:text-base">
        {config.map((id) => (
          <BusStop key={id} busStopId={id} refreshTrigger={refreshTrigger} />
        ))}
      </div>
      <Link href="/config" className="text-blue-500">
        Configure / Credits
      </Link>
    </main>
  );
}
