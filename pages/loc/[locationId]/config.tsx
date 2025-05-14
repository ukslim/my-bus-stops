"use client";
import { NewLocation } from "@/components/new-location";
import { loadConfig, loadRoutes, saveConfig, saveRoutes } from "@/utils/config";
import { querySchema } from "@/utils/schemas";
import { checkSyncId, generateSyncId, getSyncId, loadFromCloud, saveToCloud, setSyncId } from "@/utils/sync";
import Link from "next/link";
import { useRouter } from "next/router";
import type React from "react";
import { useEffect, useState } from "react";

const Config: React.FC = () => {
  const router = useRouter();
  const query = querySchema.parse(router.query);
  const { locationId } = query;
  const [ids, setIds] = useState("");
  const [current, setCurrent] = useState([] as string[]);
  const [routes, setRoutes] = useState("");
  const [currentRoutes, setCurrentRoutes] = useState([] as string[]);
  const [syncId, setSyncIdState] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string>("");

  useEffect(() => {
    setCurrent(loadConfig(locationId ?? "config"));
    setCurrentRoutes(loadRoutes(locationId ?? "config"));
    setSyncIdState(getSyncId());
  }, [locationId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const idArray: string[] = ids.split("\n").map((id) => id.trim());
    saveConfig(locationId ?? "config", idArray);
    setCurrent(idArray);
  };

  const handleRoutesSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const routeArray: string[] = routes.split("\n").map((route) => route.trim()).filter(Boolean);
    saveRoutes(locationId ?? "config", routeArray);
    setCurrentRoutes(routeArray);
  };

  const handleSyncIdSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSyncError("");
    setSyncSuccess("");
    
    const form = event.currentTarget;
    const input = form.elements.namedItem('syncId') as HTMLInputElement;
    const newSyncId = input.value.trim();
    
    try {
      // First check if the sync ID exists
      const exists = await checkSyncId(newSyncId);
      if (!exists) {
        setSyncError("This sync ID doesn't exist. Please check and try again.");
        return;
      }

      await loadFromCloud(newSyncId);
      setSyncId(newSyncId);
      setSyncIdState(newSyncId);
      setSyncSuccess("Successfully loaded configuration from cloud!");
      router.reload();
    } catch (error) {
      setSyncError("Failed to load configuration. Please check your sync ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!syncId) return;
    setIsLoading(true);
    setSyncError("");
    setSyncSuccess("");
    
    try {
      await saveToCloud(syncId);
      setSyncSuccess("Successfully saved configuration to cloud!");
    } catch (error) {
      console.error(error);
      setSyncError("Failed to save configuration to cloud.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNewId = () => {
    const newId = generateSyncId();
    setSyncId(newId);
    setSyncIdState(newId);
    setSyncSuccess("New sync ID generated! Make sure to save your changes to cloud.");
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
      <p className="mb-4">
        Version:{" "}
        {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7)}
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

      <h1 className="text-2xl font-bold mb-4">Configure Routes of Interest</h1>
      <p className="mb-4">
        Enter the route numbers you&apos;re interested in, one per line. Leave empty to show all routes.
      </p>
      <form onSubmit={handleRoutesSubmit} className="mb-4">
        <label className="block mb-2">
          Enter routes, one per line:
          <textarea
            defaultValue={currentRoutes.join("\n")}
            onChange={(e) => setRoutes(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
            rows={4}
          />
        </label>
        <input
          type="submit"
          value="Update Routes"
          className="p-2 bg-blue-500 text-white rounded-md cursor-pointer"
        />
      </form>

      <h1 className="text-2xl font-bold mb-4">Add new location</h1>
      <div className="mb-4">
        <NewLocation />
      </div>
      <Link
        href={`/loc/${locationId}`}
        className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        Back to {locationId}
      </Link>
      <div className="mb-8 mt-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Sync Settings</h2>
        <p className="mb-4">Save your configuration to a cloud service to use on other devices. Your saved settings will expire in 1 day, but will stay in your browser forever.</p>
        {!syncId ? (
          <div className="mb-4">
            <p className="mb-2">No sync ID set. Generate one or enter an existing ID:</p>
            <button
              onClick={handleGenerateNewId}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition-colors"
            >
              Generate New ID
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <p className="mb-2">Your sync ID: <code className="bg-gray-100 px-2 py-1 rounded select-all">{syncId}</code></p>
            <p className="text-sm text-gray-600 mb-4">Save this ID to use on other devices</p>
            <button
              onClick={handleSaveToCloud}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save to Cloud'}
            </button>
          </div>
        )}
        
        <form onSubmit={handleSyncIdSubmit} className="mt-4">
          <div className="flex items-center">
            <input
              type="text"
              name="syncId"
              placeholder="Enter sync ID"
              className="border p-2 rounded mr-2 flex-grow"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load from Cloud'}
            </button>
          </div>
        </form>
        
        {syncError && (
          <p className="text-red-500 mt-2">{syncError}</p>
        )}
        
        {syncSuccess && (
          <p className="text-green-500 mt-2">{syncSuccess}</p>
        )}
        
        <p className="mt-4 text-sm text-gray-600">
          Warning: Loading from cloud will replace all your local configurations
        </p>
      </div>
    </div>
  );
};

export default Config;
