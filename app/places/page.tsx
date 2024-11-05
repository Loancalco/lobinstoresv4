// app/places/page.tsx

import { BinStoresList } from './BinStoresList';
import { BinStore } from './types';
import { NextPage } from 'next';

// Define a type for the return type of getBinStores
type BinStoresResponse = {
  binStores: BinStore[];
} | {
  error: string;
};

// Fetch bin stores data on the server side
async function getBinStores(state: string): Promise<BinStoresResponse> {
  const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'local-business-data.p.rapidapi.com';
  const apiUrl = `https://${apiHost}/search?query=bin%20stores%20in%20${state}`;

  if (!apiKey) {
    console.error("RapidAPI Key is missing.");
    return { error: "RapidAPI Key is not configured." };
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from RapidAPI: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return { binStores: data.results || [] }; // Adjust this based on the API response structure
  } catch (error) {
    console.error("Fetch error:", error); // Log the error details
    return { error: "Could not fetch bin stores. Please try again." };
  }
}

type PageProps = {
  searchParams: {
    state?: string;
  };
};

const PlacesPage: NextPage<PageProps> = async ({ searchParams }) => {
  const state = searchParams.state || '';
  
  if (!state) {
    return <p>Please provide a state parameter in the URL.</p>;
  }

  const result = await getBinStores(state);

  // Type Narrowing
  if ("error" in result) {
    return <p>{result.error}</p>;
  }

  const { binStores } = result;

  return (
    <div>
      <h1>Bin Stores in {state}</h1>
      <BinStoresList binStores={binStores} />
    </div>
  );
};

export default PlacesPage;
