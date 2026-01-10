// frontend/src/components/calcLifestyle/ResultDisplay.tsx
import React from 'react';

interface ResultDisplayProps {
  total: number;
  breakdown: Record<string, number>;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ total, breakdown }) => {
  const categoryColors: Record<string, string> = {
    logement: "bg-amber-500 text-amber-500",
    alimentation: "bg-emerald-500 text-emerald-500",
    loisirs: "bg-purple-500 text-purple-500",
    transport: "bg-blue-500 text-blue-500"
  };

  const getIntensityColor = (score: number) => {
      if (score < 50) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      if (score < 150) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Header Resultat */}
      <div className="relative p-6 sm:p-8 text-center border-b border-slate-800 bg-gradient-to-b from-slate-800/50 to-transparent">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Empreinte Mensuelle Estimée
        </h3>
        <div className="flex items-baseline justify-center gap-2">
            <span className={`text-5xl sm:text-6xl font-black tracking-tight ${getIntensityColor(total).split(' ')[0]}`}>
                {total.toFixed(1)}
            </span>
            <span className="text-xl font-medium text-slate-500">kg CO₂</span>
        </div>
        
        {/* Badge annuel */}
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${getIntensityColor(total)}`}>
            <span>≈ {(total * 12).toFixed(0)} kg CO₂ / an</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-6 space-y-5 bg-slate-900/50">
        <h4 className="text-sm font-medium text-slate-300">Détail par catégorie</h4>
        <div className="space-y-4">
            {Object.entries(breakdown).map(([key, value]) => {
                const percentage = total > 0 ? (value / total) * 100 : 0;
                const colorClass = categoryColors[key] || "bg-slate-400 text-slate-400";
                
                return (
                <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="capitalize text-slate-300 font-medium flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${colorClass.split(' ')[0]}`}></span>
                            {key}
                        </span>
                        <span className="text-slate-400">{value.toFixed(1)} <span className="text-xs">kg</span></span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass.split(' ')[0]}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                );
            })}
        </div>
      </div>

      {/* Conseils */}
      {total >= 150 && (
          <div className="bg-slate-800/30 p-5 border-t border-slate-800">
            <div className="flex gap-3">
                <div className="flex-shrink-0 text-amber-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-1">Pistes d'amélioration</h4>
                    <ul className="text-sm text-slate-400 space-y-1 list-disc pl-4 marker:text-slate-600">
                        <li>Réduire la consommation de viande rouge peut avoir un impact majeur.</li>
                        <li>Privilégier les produits de saison et locaux.</li>
                    </ul>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};