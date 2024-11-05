// pages/places.tsx
"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Places() {
  const router = useRouter();
  const { state } = router.query;

  // Local state to hold the name of the selected state
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof state === 'string') {
      setSelectedState(state);
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
        {selectedState ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Places in {selectedState}</h1>
            {/* Placeholder for places content */}
            <p>Displaying places of interest in {selectedState}...</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
