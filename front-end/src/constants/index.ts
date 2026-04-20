export const LS_KEY = "succession_wizard_v3";

export const STEPS = [
  "Défunt",
  "Héritiers",
  "Actifs",
  "Coordonnées",
  "Récapitulatif",
];

export const LIENS = [
  { value: "enfant", label: "Enfant" },
  { value: "conjoint", label: "Conjoint(e)" },
  { value: "parent", label: "Parent" },
  { value: "frere_soeur", label: "Frère / Sœur" },
  { value: "autre", label: "Autre" },
];


export const ASSET_TYPES = [
  { value: "livret", label: "Livret bancaire" },
  { value: "immo", label: "Bien immobilier" },
  { value: "vehicule", label: "Véhicule" },
  { value: "autre", label: "Autre" },
];
export const QUALITES = [
  { value: "heritier", label: "Je suis l'héritier principal" },
  { value: "mandataire", label: "Mandataire" },
  { value: "autre", label: "Autre" },
];

export const initialState = {
  step: 0,
  defunt: { nom: "", prenom: "", dob: "", dod: "", commune: "" },
  heirs: [{ nom: "", prenom: "", lien: "", dob: "" }],
  assets: [{ type: "", valeur: "", adresse: "" }],
  declarant: { nom: "", prenom: "", adresse: "", email: "", telephone: "", qualite: "" },
  certs: { exact: false, cgu: false },
};