// app/api/fetchPlaces/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'local-business-data.p.rapidapi.com';
  const apiUrl = `https://${apiHost}/search?query=bin%20stores%20in%20${state}`;

  if (!state) {
    return NextResponse.json({ error: "State parameter is required" }, { status: 400 });
  }

  if (!apiKey) {
    console.error("RapidAPI Key is missing.");
    return NextResponse.json({ error: "RapidAPI Key is not configured." }, { status: 500 });
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from RapidAPI: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response Data:", data); // Log the full response for debugging

    return NextResponse.json({ binStores: data.results || [] });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Could not fetch bin stores. Please try again." }, { status: 500 });
  }
}
