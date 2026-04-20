export interface Defunt {
  nom: string;
  prenom: string;
  dob: string;
  dod: string;
  commune: string;
}

export interface Heir {
  nom: string;
  prenom: string;
  lien: string;
  dob: string;
}

export interface Asset {
  type: string;
  valeur: string;
  adresse: string;
}

export interface Declarant {
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  telephone: string;
  qualite: string;
}

export interface Certs {
  exact: boolean;
  cgu: boolean;
}

export interface WizardState {
  step: number;
  defunt: Defunt;
  heirs: Heir[];
  assets: Asset[];
  declarant: Declarant;
  certs: Certs;
}