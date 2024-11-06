// app/api/fetchPlaces/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');

  if (!state) {
    return NextResponse.json({ error: "State parameter is required" }, { status: 400 });
  }

  try {
    // Build the path to the state-specific JSON file
    const filePath = path.join(process.cwd(), 'data', `${state}.json`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Data for ${state} not found.` }, { status: 404 });
    }

    // Read and parse the JSON data
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const binStores = JSON.parse(fileContents);

    return NextResponse.json({ binStores });
  } catch (error) {
    console.error("Error reading bin stores data:", error);
    return NextResponse.json({ error: "Could not fetch bin stores. Please try again." }, { status: 500 });
  }
}
