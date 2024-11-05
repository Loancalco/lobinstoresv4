// app/api/fetchPlaces/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  //const apiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;

  if (!state) {
    return NextResponse.json({ error: "State parameter is required" }, { status: 400 });
  }

  

  try {
    const response = await fetch(`https://local-business-data.p.rapidapi.com/search?query=bin stores in ${state}`, {
      headers: {
'x-rapidapi-key': 'a155812e96msh3d468699207ae72p1c60dbjsn964b74afebd5',
'x-rapidapi-host': 'local-business-data.p.rapidapi.com',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from Foursquare API");
    }

    const data = await response.json();
    return NextResponse.json({ places: data.results }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not fetch places" }, { status: 500 });
  }
}
