import type { NextApiRequest, NextApiResponse } from "next";

// Purely a proxy for CORS reasons
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  try {
    const response = await fetch(
      `https://bustimes.org/stops/${id}/times.json?limit=3`,
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bus times" });
  }
}
