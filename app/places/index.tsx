// app/places/index.tsx
"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type BinStore = {
  fsq_id: string;
  name: string;
  location?: {
    formatted_address?: string;
  };
  contact?: {
    phone?: string;
  };
  website?: string;
};

type PlacesProps = {
  initialBinStores: BinStore[];
  error?: string;
};

export default function BinStores({ initialBinStores, error }: PlacesProps) {
  const searchParams = useSearchParams();
  const state = searchParams.get('state'); // Get the 'state' query parameter

  const [binStores, setBinStores] = useState<BinStore[]>(initialBinStores);

  useEffect(() => {
    if (!initialBinStores && state) {
      fetchBinStores(state);
    }
  }, [state, initialBinStores]);

  async function fetchBinStores(stateParam: string) {
    try {
      const response = await fetch(`/api/?state=${stateParam}`);
      const data = await response.json();
      if (data.binStores) {
        setBinStores(data.binStores);
      } else {
        throw new Error("Failed to fetch bin stores");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Bin Stores in {state}</h1>
      <div>
        {binStores && binStores.length > 0 ? (
          binStores.map((store) => (
            <div key={store.fsq_id} className="mb-4 p-4 border border-gray-200 rounded-lg shadow">
              <h2 className="text-xl font-bold">{store.name}</h2>
              <p><strong>Address:</strong> {store.location?.formatted_address || "Not available"}</p>
              <p><strong>Phone:</strong> {store.contact?.phone || "Not available"}</p>
              {store.website ? (
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {store.website}
                  </a>
                </p>
              ) : (
                <p><strong>Website:</strong> Not available</p>
              )}
            </div>
          ))
        ) : (
          <p>No bin stores found</p>
        )}
      </div>
    </div>
  );
}
