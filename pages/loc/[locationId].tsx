import BusStops from "@/components/bus-stops";
import { loadConfig } from "@/app/config";
import { configSchema, querySchema } from "@/app/schemas";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LocationPage = () => {
  const router = useRouter();
  const query = querySchema.parse(router.query);
  const { locationId } = query;
  const [config, setConfig] = useState<string[]>([]);

  useEffect(() => {
    setConfig(loadConfig(locationId ?? "config"));
  }, [locationId]);

  return (
    <main className="min-h-screen items-center p-0 sm:p-25 sm:text-base">
      <h1 className="text-3xl font-bold mt-1 sm:mt-4">Buses {locationId}</h1>
      <BusStops config={config} />
      <Link href={`${locationId}/config`} className="text-blue-500">
        Configure / Credits
      </Link>
    </main>
  );
};

export default LocationPage;
