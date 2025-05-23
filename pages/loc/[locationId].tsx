import BusStops from "@/components/bus-stops";
import { listConfigs, loadConfig, loadRoutes } from "@/utils/config";
import { querySchema } from "@/utils/schemas";
import Link from "next/link";
import { useRouter } from "next/router";
import type React from "react";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

const LocationPage: React.FC = () => {
  const router = useRouter();
  const query = querySchema.parse(router.query);
  const { locationId } = query;
  const [config, setConfig] = useState<string[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [isFiltered, setIsFiltered] = useState(true);
  const [routes, setRoutes] = useState<string[]>([]);

  useEffect(() => {
    setIds(listConfigs());
    setConfig(loadConfig(locationId ?? "config"));
    setRoutes(loadRoutes(locationId ?? "config"));
  }, [locationId]);

  const currentIndex = ids.indexOf(locationId ?? "home");
  const nextIndex = (currentIndex + 1) % ids.length;
  const prevIndex = (currentIndex - 1 + ids.length) % ids.length;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      router.push(`/loc/${ids[prevIndex]}`);
    },
    onSwipedRight: () => {
      router.push(`/loc/${ids[nextIndex]}`);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <main
      {...handlers}
      className="min-h-screen items-center p-0 sm:p-25 sm:text-base"
    >
      <ul className="flex space-x-4 bg-blue-500 text-white p-4">
        {ids.map((id) => (
          <li key={id} className={id === locationId ? "underline" : ""}>
            <Link href={`/loc/${id}`} className="">
              {id}
            </Link>
          </li>
        ))}
      </ul>
      <BusStops config={config} isFiltered={isFiltered} routes={routes} />
      <div className="flex items-center space-x-4 p-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isFiltered}
            onChange={(e) => setIsFiltered(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
          <span>Filter Routes</span>
        </label>
        <Link href={`${locationId}/config`} className="text-blue-500">
          Configure / Credits
        </Link>
      </div>
    </main>
  );
};

export default LocationPage;
