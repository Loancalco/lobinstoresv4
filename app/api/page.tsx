// pages/api/fetchPlaces.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type Place = {
  // Define fields as per the Foursquare API response structure
  fsq_id: string;
  name: string;
  location: {
    address: string;
    country: string;
    locality: string;
    region: string;
    [key: string]: any; // in case there are additional location fields
  };
  categories: Array<{
    id: number;
    name: string;
    [key: string]: any; // in case there are additional category fields
  }>;
  [key: string]: any; // in case there are additional fields in the place object
};

type DataResponse = {
  places: Place[];
} | {
  error: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<DataResponse>) {
  const { state } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;

  if (!state || typeof state !== 'string') {
    return res.status(400).json({ error: "State parameter is required" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "Foursquare API key is missing" });
  }

  try {
    const response = await fetch(`https://api.foursquare.com/v3/places/search?near=${state}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from Foursquare API");
    }

    const data = await response.json();

    // Assuming `data.results` is an array of places as per the Foursquare API
    res.status(200).json({ places: data.results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch places" });
  }
}
