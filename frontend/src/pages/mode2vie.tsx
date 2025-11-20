// frontend/src/pages/mode2vie.tsx
import { LifestyleForm } from '../components/calcLifestyle/LifestyleForm';
import { useProduits } from '../hooks/useProduits';

const LifestylePage = () => {
  const { produits, loading, error } = useProduits();

  if (loading) return <div className="text-brand-100">Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Calculateur d'empreinte carbone
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-brand-100">
            Évaluez votre impact climatique
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Renseignez vos habitudes pour estimer votre empreinte carbone et découvrir des pistes d'amélioration.
          </p>
        </header>

        {/* Formulaire */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <LifestyleForm produits={produits} />
        </section>

        {/* Section d'informations */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
          <h2 className="text-lg font-medium text-slate-100 mb-3">Pourquoi calculer son empreinte ?</h2>
          <p className="mb-2">
            Comprendre son impact carbone est la première étape pour agir. Ce calculateur estime vos émissions
            basées sur vos choix quotidiens.
          </p>
        </section>
      </div>
    </main>
  );
};

export default LifestylePage;
