// app/api/fetchPlaces/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract the 'state' query parameter from the request URL
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'local-business-data.p.rapidapi.com';
  const apiUrl = `https://${apiHost}/search?query=bin%20stores%20in%20${state}`;

  // Check if the state parameter and API key are provided
  if (!state) {
    return NextResponse.json({ error: "State parameter is required" }, { status: 400 });
  }

  if (!apiKey) {
    console.error("RapidAPI Key is missing.");
    return NextResponse.json({ error: "RapidAPI Key is not configured." }, { status: 500 });
  }

  try {
    // Fetch data from the RapidAPI endpoint
    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch data from RapidAPI: ${response.status} - ${response.statusText}`);
    }

    // Parse the response JSON
    const data = await response.json();

    // Return the fetched bin stores data
    return NextResponse.json({ binStores: data.results || [] }); // Adjust `data.results` if the structure is different
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Could not fetch bin stores. Please try again." }, { status: 500 });
  }
}
