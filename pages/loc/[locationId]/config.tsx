"use client";
import { listConfigs, loadConfig, saveConfig } from "@/app/config";
import { querySchema } from "@/app/schemas";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    const idArray: string[] = ids.split(",").map((id) => id.trim());
    const asJson = JSON.stringify(idArray);
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
          Enter comma-separated IDs:
          <input
            type="text-area"
            value={ids}
            onChange={(e) => setIds(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </label>
        <input
          type="submit"
          value="Submit"
          className="p-2 bg-blue-500 text-white rounded-md cursor-pointer"
        />
      </form>
      <h3 className="text-xl font-semibold mb-2">Current configuration:</h3>
      <pre className="mb-4 whitespace-pre-wrap">{current.join(", ")}</pre>
      <Link href={`/loc/${locationId}`} className="text-blue-500 underline">
        Back to {locationId}
      </Link>
    </div>
  );
}
