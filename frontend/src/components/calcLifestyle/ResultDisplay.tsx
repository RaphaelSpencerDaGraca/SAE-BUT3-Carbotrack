// frontend/src/components/calcLifestyle/ResultDisplay.tsx
import React from 'react';

interface ResultDisplayProps {
  total: number;
  breakdown: Record<string, number>;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ total, breakdown }) => {
  // Couleurs pour les catégories
  const categoryColors: Record<string, string> = {
    logement: "text-amber-400",
    alimentation: "text-green-400",
    loisirs: "text-purple-400",
  };

  return (
    <div className="rounded-lg border border-brand-500/30 bg-slate-900/30 p-4">
      <div className="flex items-baseline gap-2">
        <h3 className="text-lg font-medium text-brand-100">Votre empreinte carbone estimée :</h3>
        <span className="text-2xl font-bold text-brand-500">{total.toFixed(1)} kg CO₂</span>
      </div>

      <div className="mt-4 space-y-2">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <div className="flex items-center gap-2">
              <span className="capitalize text-slate-300">{key}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">{value.toFixed(1)} kg CO₂</span>
              <div className="h-2 w-16 rounded-full bg-slate-700">
                <div
                  className={`h-full rounded-full ${categoryColors[key] || "bg-slate-400"}`}
                  style={{ width: `${(value / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message d'interprétation */}
      <div className="mt-4 rounded-md bg-slate-800/50 p-3 text-sm text-slate-300">
        <p>
          Votre empreinte annuelle estimée serait d'environ{' '}
          <strong className="font-medium text-brand-100">{(total * 12).toFixed(0)} kg CO₂</strong>
          {total < 50 && ' – Très faible !'}
          {total >= 50 && total < 150 && ' – Dans la moyenne.'}
          {total >= 150 && ' – Élevée. Voici des pistes pour la réduire :'}
        </p>
        {total >= 150 && (
          <ul className="mt-2 list-disc pl-4 text-xs text-slate-400">
            <li>Privilégiez les transports en commun ou le covoiturage.</li>
            <li>Réduisez votre consommation de viande.</li>
            <li>Isolez mieux votre logement.</li>
          </ul>
        )}
      </div>
    </div>
  );
};

