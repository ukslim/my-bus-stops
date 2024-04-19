"use client";
import { NewLocation } from "@/components/new-location";
import { listConfigs, loadConfig, saveConfig } from "@/utils/config";
import { querySchema } from "@/utils/schemas";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function Config() {
  const router = useRouter();
  const query = querySchema.parse(router.query);
  const { locationId } = query;
  const [ids, setIds] = useState("");
  const [current, setCurrent] = useState([] as string[]);

  useEffect(() => {
    setCurrent(loadConfig(locationId ?? "config"));
  }, [locationId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const idArray: string[] = ids.split("\n").map((id) => id.trim());
    console.log("Saving", idArray);
    saveConfig(locationId ?? "config", idArray);
    setCurrent(idArray);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mt-1 sm:mt-4">Acknowledgements</h1>
      <p className="mb-4 ">
        We use the API from{" "}
        <a href="https://bustimes.org" className="text-blue-500 underline">
          bustimes.org
        </a>{" "}
        which themselves make use of public APIs they credit on their own page.
        Thank you everyone.
      </p>
      <p className="mb-4 ">
        Source is in{" "}
        <a
          href="https://github.com/ukslim/my-bus-stops"
          className="text-blue-500 underline"
        >
          GitHub
        </a>
        .
      </p>
      <h1 className="text-2xl font-bold mb-4">
        Configure Stops ({locationId})
      </h1>
      <p className="mb-4">
        You can find bus stop IDs on{" "}
        <a href="https://bustimes.org" className="text-blue-500 underline">
          bustimes.org
        </a>
      </p>
      <p className="mb-4 ">
        Enter them here, comma separated and click to save.
      </p>
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block mb-2">
          Enter IDs, one per line:
          <textarea
            defaultValue={current.join("\n")}
            onChange={(e) => setIds(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
            rows={4}
          />
        </label>
        <input
          type="submit"
          value="Update"
          className="p-2 bg-blue-500 text-white rounded-md cursor-pointer"
        />
      </form>
      <h1 className="text-2xl font-bold mb-4">Add new location</h1>
      <NewLocation />
      <h1 className="text-2xl font-bold mb-4">Back to {locationId}</h1>
      <Link
        href={`/loc/${locationId}`}
        className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        Back to {locationId}
      </Link>
    </div>
  );
}
