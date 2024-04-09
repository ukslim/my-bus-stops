"use client";
import { useEffect, useState } from "react";
import BusStop from "./bus-stop";
import { configSchema } from "./schemas";

export default function Home() {
	const [config, setConfig] = useState<string[]>([]);

	useEffect(() => {
		const data = localStorage.getItem("config");
		setConfig(configSchema.parse(JSON.parse(data ?? "[]")));
	}, []);
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1 className="text-4xl font-bold mt-4">Buses</h1>
			{config.map((id) => (
				<BusStop key={id} busStopId={id} />
			))}
		</main>
	);
}
