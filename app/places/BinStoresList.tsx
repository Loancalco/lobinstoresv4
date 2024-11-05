// app/places/BinStoresList.tsx
"use client";

import React from 'react';
import { BinStore } from './types';

type BinStoresListProps = {
  binStores: BinStore[];
};

export function BinStoresList({ binStores }: BinStoresListProps) {
  return (
    <div>
      {binStores.length > 0 ? (
        binStores.map((data) => (
          <div key={store.fsq_id} className="mb-4 p-4 border border-gray-200 roundedo-lg shadow">
            <h2 className="text-xl font-bold">{data.name}</h2>
            <p><strong>Address:</strong> {data.location?.formatted_address || "Not available"}</p>
            <p><strong>Phone:</strong> {data.contact?.phone || "Not available"}</p>
            {data.website ? (
              <p>
                <strong>Website:</strong>{' '}
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {data.website}
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
  );
}
