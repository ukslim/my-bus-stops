"use client";
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mt-4">Buses {refreshTrigger}</h1>
      {config.map((id) => (
        <BusStop key={id} busStopId={id} refreshTrigger={refreshTrigger} />
      ))}
    </main>
  );
}
