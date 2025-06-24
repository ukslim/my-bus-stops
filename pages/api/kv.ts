import { createClient } from "@vercel/kv";
import type { NextApiRequest, NextApiResponse } from "next";

const url = process.env.KV_KV_REST_API_URL;
const token = process.env.KV_KV_REST_API_TOKEN;

if (!url || !token) {
  throw new Error(
    "Missing KV_KV_REST_API_URL or KV_KV_REST_API_TOKEN environment variable"
  );
}

// Initialize KV client with server-side environment variables
const kv = createClient({
  url,
  token,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const { syncId } = req.query;
        if (!syncId || typeof syncId !== "string") {
          return res.status(400).json({ error: "Invalid sync ID" });
        }
        if (syncId === "keepalive") {
          // Perform a harmless operation to keep the DB alive
          // A cron job will call this endpoint every day to keep the providers from deleting for inactivity
          await kv.exists("keepalive");
          return res.status(200).json({ ok: true });
        }
        const exists = await kv.exists(syncId);
        if (exists === 1) {
          const data = await kv.get(syncId);
          return res.status(200).json({ data });
        }
        return res.status(404).json({ error: "Sync ID not found" });
      }

      case "POST": {
        const { syncId, data } = req.body;
        if (!syncId || !data) {
          return res.status(400).json({ error: "Missing syncId or data" });
        }
        // Set expiration to 1 day (in seconds)
        const oneDayInSeconds = 86400;
        await kv.set(syncId, data, { ex: oneDayInSeconds });
        return res.status(200).json({ success: true });
      }

      case "HEAD": {
        const { syncId } = req.query;
        if (!syncId || typeof syncId !== "string") {
          return res.status(400).json({ error: "Invalid sync ID" });
        }
        const exists = await kv.exists(syncId);
        return res.status(exists === 1 ? 200 : 404).end();
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "HEAD"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("KV API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
