export type TypeElectromenagerEnum = 
    'Refrigerateur' | 'Congelateur' | 'Lave-linge' | 'Seche-linge' | 
    'Lave-vaisselle' | 'Four' | 'Micro-ondes' | 'Televiseur' | 'Ordinateur' | 'Autre';

export interface IElectromenager {
    id?: number;
    logementId: number;
    nom: string;
    type: TypeElectromenagerEnum;
    marque?: string;
    modele?: string;
    
    consommationKwhAn: number;
    consommationEauAn: number;
    classeEnergetique?: string;

    co2FabricationKg: number;
    co2UsageKgAn: number;
    
    sourceDonnees: 'Manuel' | 'EPREL' | 'ADEME';
    dureeVieTheoriqueAns: number;
}