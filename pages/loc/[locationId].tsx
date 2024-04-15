import BusStops from '@/app/bus-stops';
import { configSchema } from '@/app/schemas';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const LocationPage = () => {
    const router = useRouter();
    const { locationId } = router.query;
    const [config, setConfig] = useState<string[]>([]);

    useEffect(() => {
      const data = localStorage.getItem("config");
      setConfig(configSchema.parse(JSON.parse(data ?? "[]")));
    }, []);

    return (
    <main className="min-h-screen items-center p-0 sm:p-25 sm:text-base">
    <h1 className="text-3xl font-bold mt-1 sm:mt-4">Buses {locationId}</h1>
    <BusStops config={config} />
    <Link href="/config" className="text-blue-500">
      Configure / Credits
    </Link>
  </main>
    )
};

export default LocationPage;
