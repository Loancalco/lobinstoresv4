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
  const apiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;
  const apiUrl = `https://api.foursquare.com/v3/places/search?near=${state}&query=bin%20store`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: apiKey || '',
      },
      // Enable cache control for SSR (optional, depending on how often data changes)
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from Foursquare API");
    }

    const data = await response.json();
    return { binStores: data.results || [] };
  } catch (error) {
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
     <div className="bg-white shadow">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bin Stores in {state}</h1>
      <BinStoresList binStores={binStores} />
    </div>
  );
};

export default PlacesPage;
