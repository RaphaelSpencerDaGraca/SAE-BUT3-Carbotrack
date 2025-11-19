// frontend/src/components/calcLifestyle/ResultDisplay.tsx
import React from 'react';

interface ResultDisplayProps {
  total: number;
  breakdown: Record<string, number>;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ total, breakdown }) => {
  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold text-lg">Votre empreinte carbone : {total.toFixed(2)} kg CO₂</h3>
      <div className="mt-2 space-y-1">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span>{key}:</span>
            <span>{value.toFixed(2)} kg CO₂</span>
          </div>
        ))}
      </div>
    </div>
  );
};
