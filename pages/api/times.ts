import type { NextApiRequest, NextApiResponse } from "next";

// Purely a proxy for CORS reasons
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  try {
    const response = await fetch(
      // We want to usually get 3 after filtering. I feel as if you could usually expect 3
      // out of the next 20 buses at a stop to be one of your routes.
      `https://bustimes.org/stops/${id}/times.json?limit=20`,
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bus times" });
  }
}
