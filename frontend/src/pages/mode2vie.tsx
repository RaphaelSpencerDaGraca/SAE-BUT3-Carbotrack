import { useAuth } from "@/hooks/useAuth";

import { useState } from 'react';

// Types pour les données de formulaire
type HousingType = 'maison' | 'appartement' | 'colocation';
type FoodHabit = 'carne_daily' | 'carne_occasionnel' | 'vegetarien' | 'vegan';
type DeviceUsage = 'faible' | 'moyen' | 'eleve';

type FormData = {
  housing: {
    type: HousingType;
    surfaceM2: number;
    energySource: 'electrique' | 'gaz' | 'fioul' | 'solaire';
    insulation: 'bonne' | 'moyenne' | 'mauvaise';
  };
  food: {
    habit: FoodHabit;
    bioPercentage: number;
    localPercentage: number;
  };
  devices: {
    usage: DeviceUsage;
    count: number;
    lifespan: number; 
  };
  leisure: {
    flightsPerYear: number;
    streamingHoursPerWeek: number;
  };
};

const LifestyleCarbonFootprint = () => {
  const [formData, setFormData] = useState<FormData>({
    housing: {
      type: 'appartement',
      surfaceM2: 50,
      energySource: 'electrique',
      insulation: 'moyenne',
    },
    food: {
      habit: 'carne_occasionnel',
      bioPercentage: 30,
      localPercentage: 40,
    },
    devices: {
      usage: 'moyen',
      count: 3,
      lifespan: 5,
    },
    leisure: {
      flightsPerYear: 0,
      streamingHoursPerWeek: 5,
    },
  });
  const [result, setResult] = useState<{ totalKgCO2: number; breakdown: Record<string, number> } | null>(null);

  // Facteurs d'émission simplifiés (à remplacer par les données ADEME réelles)
  const emissionFactors = {
    housing: {
      base: {
        maison: 1500, // kgCO2/an pour 50m2
        appartement: 1000,
        colocation: 800,
      },
      energy: {
        electrique: 0.05, // kgCO2/kWh (moyenne France)
        gaz: 0.2,
        fioul: 0.3,
        solaire: 0.02,
      },
      insulation: {
        bonne: 0.8,
        moyenne: 1.0,
        mauvaise: 1.3,
      },
    },
    food: {
      carne_daily: 1500, // kgCO2/an
      carne_occasionnel: 1000,
      vegetarien: 600,
      vegan: 400,
      bioReduction: 0.2, // 20% de réduction si bio
      localReduction: 0.15, // 15% de réduction si local
    },
    devices: {
      faible: 50, // kgCO2/an par appareil
      moyen: 150,
      eleve: 300,
      manufacturing: 200, // kgCO2 par appareil (fabrication)
    },
    leisure: {
      flightShort: 500, // kgCO2 par vol court (<2h)
      flightMedium: 1200, // kgCO2 par vol moyen (2-6h)
      flightLong: 2500, // kgCO2 par vol long (>6h)
      streaming: 0.05, // kgCO2 par heure de streaming
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof FormData], [field]: value },
    }));
  };

  const calculateFootprint = () => {
    // Logement
    const housingBase = emissionFactors.housing.base[formData.housing.type] * (formData.housing.surfaceM2 / 50);
    const housingEnergy = formData.housing.surfaceM2 * 100 * emissionFactors.housing.energy[formData.housing.energySource];
    const housingInsulation = housingBase * emissionFactors.housing.insulation[formData.housing.insulation];
    const housingEmission = housingEnergy + housingInsulation;

    // Alimentation
    let foodEmission = emissionFactors.food[formData.food.habit];
    foodEmission *= (1 - formData.food.bioPercentage / 100 * emissionFactors.food.bioReduction);
    foodEmission *= (1 - formData.food.localPercentage / 100 * emissionFactors.food.localReduction);

    // Appareils numériques
    const devicesUsageEmission = emissionFactors.devices[formData.devices.usage] * formData.devices.count;
    const devicesManufacturingEmission = (emissionFactors.devices.manufacturing * formData.devices.count) / formData.devices.lifespan;
    const devicesEmission = devicesUsageEmission + devicesManufacturingEmission;

    // Loisirs
    const flightsEmission = formData.leisure.flightsPerYear * emissionFactors.leisure.flightMedium; // hypothèse vols moyens
    const streamingEmission = formData.leisure.streamingHoursPerWeek * emissionFactors.leisure.streaming * 52;
    const leisureEmission = flightsEmission + streamingEmission;

    // Total
    const total = housingEmission + foodEmission + devicesEmission + leisureEmission;

    setResult({
      totalKgCO2: parseFloat(total.toFixed(2)),
      breakdown: {
        housing: parseFloat(housingEmission.toFixed(2)),
        food: parseFloat(foodEmission.toFixed(2)),
        devices: parseFloat(devicesEmission.toFixed(2)),
        leisure: parseFloat(leisureEmission.toFixed(2)),
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Mon mode de vie
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Calculez votre empreinte carbone
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Renseignez vos habitudes pour obtenir une estimation personnalisée (hors déplacements).
          </p>
        </header>

        {/* Formulaire */}
        <section className="space-y-6">

          {/* Logement */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-medium text-slate-100">Logement</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <label className="block text-xs text-slate-400">Type</label>
                <select
                  name="housing.type"
                  value={formData.housing.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                >
                  {Object.keys(emissionFactors.housing.base).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400">Surface (m²)</label>
                <input
                  type="number"
                  name="housing.surfaceM2"
                  value={formData.housing.surfaceM2}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                  min="10"
                  max="300"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">Source d'énergie</label>
                <select
                  name="housing.energySource"
                  value={formData.housing.energySource}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                >
                  {Object.keys(emissionFactors.housing.energy).map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400">Isolation</label>
                <select
                  name="housing.insulation"
                  value={formData.housing.insulation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                >
                  {Object.keys(emissionFactors.housing.insulation).map((insulation) => (
                    <option key={insulation} value={insulation}>
                      {insulation}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Alimentation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-medium text-slate-100">Alimentation</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <label className="block text-xs text-slate-400">Régime alimentaire</label>
                <select
                  name="food.habit"
                  value={formData.food.habit}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                >
                  {Object.keys(emissionFactors.food).filter(k => !k.includes('Reduction')).map((habit) => (
                    <option key={habit} value={habit}>
                      {habit.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400">% de produits bio</label>
                <input
                  type="range"
                  name="food.bioPercentage"
                  min="0"
                  max="100"
                  value={formData.food.bioPercentage}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span className="text-xs text-slate-400">{formData.food.bioPercentage}%</span>
              </div>
              <div>
                <label className="block text-xs text-slate-400">% de produits locaux</label>
                <input
                  type="range"
                  name="food.localPercentage"
                  min="0"
                  max="100"
                  value={formData.food.localPercentage}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span className="text-xs text-slate-400">{formData.food.localPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Appareils numériques */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-medium text-slate-100">Appareils numériques</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <label className="block text-xs text-slate-400">Usage</label>
                <select
                  name="devices.usage"
                  value={formData.devices.usage}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                >
                  {Object.keys(emissionFactors.devices).filter(k => !k.includes('manufacturing')).map((usage) => (
                    <option key={usage} value={usage}>
                      {usage}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400">Nombre d'appareils</label>
                <input
                  type="number"
                  name="devices.count"
                  value={formData.devices.count}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">Durée de vie (années)</label>
                <input
                  type="number"
                  name="devices.lifespan"
                  value={formData.devices.lifespan}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>

          {/* Loisirs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-medium text-slate-100">Loisirs</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-400">Vols long-courriers/an</label>
                <input
                  type="number"
                  name="leisure.flightsPerYear"
                  value={formData.leisure.flightsPerYear}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">Heures de streaming/semaine</label>
                <input
                  type="number"
                  name="leisure.streamingHoursPerWeek"
                  value={formData.leisure.streamingHoursPerWeek}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-900 py-2 text-sm text-slate-50 focus:ring-emerald-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculateFootprint}
            className="inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 shadow-sm hover:bg-emerald-500/20"
          >
            Calculer mon empreinte
          </button>
        </section>

        {/* Résultats */}
        {result && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-medium text-slate-100">Votre empreinte carbone estimée</h2>
            <div className="mt-3">
              <p className="text-3xl font-bold text-emerald-300">{result.totalKgCO2} kg CO₂/an</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                {Object.entries(result.breakdown).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-slate-800/60 p-3">
                    <p className="text-xs text-slate-400 capitalize">
                      {key === 'leisure' ? 'loisirs' : key}
                    </p>
                    <p className="text-lg font-semibold text-slate-50">{value} kg</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-slate-800/40 p-4">
                <h3 className="text-sm font-medium text-slate-100">Conseils personnalisés</h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-slate-300">
                  {result.breakdown.housing > 1500 && (
                    <li>Améliorez l'isolation de votre logement pour réduire jusqu'à 30% vos émissions.</li>
                  )}
                  {result.breakdown.food > 1000 && (
                    <li>Augmentez votre consommation de produits locaux et bio pour réduire votre impact alimentaire.</li>
                  )}
                  {result.breakdown.devices > 300 && (
                    <li>Allongez la durée de vie de vos appareils ou réduisez leur nombre.</li>
                  )}
                  {result.breakdown.leisure > 500 && (
                    <li>Limitez les vols long-courriers et privilégiez le train pour les trajets moyens.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default LifestyleCarbonFootprint;
