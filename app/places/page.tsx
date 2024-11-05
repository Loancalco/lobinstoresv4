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
 // const apiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;
  const apiUrl = `https://local-business-data.p.rapidapi.com/search?query=bin stores in ${state}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
      x-rapidapi-key: a155812e96msh3d468699207ae72p1c60dbjsn964b74afebd5,
      x-rapidapi-host: local-business-data.p.rapidapi.com,
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bin Stores in {state}</h1>
      <BinStoresList binStores={binStores} />
    </div></div>
  );
};

export default PlacesPage;
