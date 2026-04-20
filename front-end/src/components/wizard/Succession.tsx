
import { useCallback, useState } from "react";

import Step1 from "../steps/Step1";
import Step2 from "../steps/Step2";
import Step3 from "../steps/Step3";
import Step4 from "../steps/Step4";
import Step5 from "../steps/Step5";

import SavedBadge from "../shared/SavedBadge";
import type { Asset, Certs, Declarant, Defunt, Heir } from "../../types";
import { initialState, LS_KEY } from "../../constants";
import { isValidDate, isValidEmail } from "../../utils/helpers";

const STEPS = [
  "Défunt",
  "Héritiers",
  "Actifs",
  "Coordonnées",
  "Récapitulatif",
];

function Succession() {
  const [state, setState] = useState(() => {
      try {
        const saved = localStorage.getItem(LS_KEY);
        return saved ? JSON.parse(saved) : initialState;
      } catch {
        return initialState;
      }
    });
  const [errors, setErrors] = useState({});

  const [savedVisible] = useState(false);
  const progress = ((state.step + 1) / 5) * 100;


  const setDefunt = useCallback((field: string, val: string | number) =>
      setState((s: { defunt: Defunt; }) => ({ ...s, defunt: { ...s.defunt, [field]: val } })), []);

  const setDeclarant = useCallback((field: string, value: string) =>
    setState((s: { declarant: Declarant; }) => ({ ...s, declarant: { ...s.declarant, [field]: value } })), []);

  const setHeir = useCallback((i: number, field: string, val: string | number) =>
    setState((s: { heirs: Heir[]; }) => {
      const h = [...s.heirs];
      h[i] = { ...h[i], [field]: val };
      return { ...s, heirs: h };
    }), []);
  const setCert = useCallback((field : string, val: string) =>
    setState((s: { certs: Certs; }) => ({ ...s, certs: { ...s.certs, [field]: val } })), []);
  

  const addHeir = useCallback(() =>
    setState((s: { heirs: Heir[]; }) => ({ ...s, heirs: [...s.heirs, { nom: "", prenom: "", lien: "", dob: "" }] })), []);

  const removeHeir = useCallback((i: number) =>
    setState((s: { heirs: Heir[]; }) => ({ ...s, heirs: s.heirs.filter((_, idx) => idx !== i) })), []);

  const setAsset = useCallback((i: number, field: string, val: string | number) =>
    setState((s: { assets: Asset[]; }) => {
      const a = [...s.assets];
      a[i] = { ...a[i], [field]: val };
      return { ...s, assets: a };
    }), []);

  const addAsset = useCallback(() =>
    setState((s: { assets: Asset[]; }) => ({ ...s, assets: [...s.assets, { type: "", valeur: "", adresse: "" }] })), []);

  const removeAsset = useCallback((i: number) =>
    setState((s: { assets: Asset[]; }) => ({ ...s, assets: s.assets.filter((_: Asset, idx: number) => idx !== i) })), []);

  const validate = () => {
  const errs: Record<string, unknown> = {};

  // ───────── STEP 0 : DEFUNT ─────────
  if (state.step === 0) {
    const d = state.defunt;

    if (!d.nom?.trim()) errs.nom = "Champ obligatoire";
    if (!d.prenom?.trim()) errs.prenom = "Champ obligatoire";

    if (!isValidDate(d.dob)) errs.dob = "Date invalide";
    if (!isValidDate(d.dod)) errs.dod = "Date invalide";

    if (d.dob && d.dod && new Date(d.dod) < new Date(d.dob)) {
      errs.dod = "Doit être après la date de naissance";
    }

    if (!d.commune?.trim()) errs.commune = "Champ obligatoire";
  }

  // ───────── STEP 1 : HEIRS ─────────
  else if (state.step === 1) {
    const hErrs: Record<number, unknown> = {};

    state.heirs.forEach((h: { nom: string; prenom: string; lien: string; dob: string; }, i: number) => {
      const e: Record<string, string> = {};

      if (!h.nom?.trim()) e.nom = "Champ obligatoire";
      if (!h.prenom?.trim()) e.prenom = "Champ obligatoire";
      if (!h.lien) e.lien = "Champ obligatoire";
      if (!isValidDate(h.dob)) e.dob = "Date invalide";

      if (Object.keys(e).length > 0) {
        hErrs[i] = e;
      }
    });

    if (Object.keys(hErrs).length > 0) {
      errs.heirs = hErrs;
    }
  }

  // ───────── STEP 2 : ASSETS ─────────
  else if (state.step === 2) {
    const aErrs: Record<number, unknown> = {};

    state.assets.forEach((a: { type: string; valeur: string; adresse: string; }, i: number) => {
      const e: Record<string, string> = {};

      if (!a.type) e.type = "Champ obligatoire";
      if (!a.valeur) e.valeur = "Valeur obligatoire";

      if (a.type === "immo" && !a.adresse?.trim()) {
        e.adresse = "Adresse obligatoire pour un bien immobilier";
      }

      if (Object.keys(e).length > 0) {
        aErrs[i] = e;
      }
    });

    if (Object.keys(aErrs).length > 0) {
      errs.assets = aErrs;
    }
  }

  // ───────── STEP 3 : DECLARANT ─────────
  else if (state.step === 3) {
    const d = state.declarant;

    if (!d.nom?.trim()) errs.nom = "Champ obligatoire";
    if (!d.prenom?.trim()) errs.prenom = "Champ obligatoire";
    if (!d.adresse?.trim()) errs.adresse = "Champ obligatoire";

    if (!isValidEmail(d.email)) errs.email = "Email invalide";
    if (!d.telephone?.trim()) errs.telephone = "Champ obligatoire";
    if (!d.qualite) errs.qualite = "Champ obligatoire";
  }

  setErrors(errs);
  return Object.keys(errs).length === 0;
};

const goNext = () => { if (validate()) setState((s: { step: number; }) => ({ ...s, step: s.step + 1 })); };
  const goBack = () => { setErrors({}); setState((s: { step: number; }) => ({ ...s, step: s.step - 1 })); };

  return (
    <div className="container">
      <h1 className="srOnly">
        Formulaire de déclaration de succession
      </h1>

      {/* HEADER */}
      <div className="header">
        <div className="headerTop">
          <span className="stepCounter">
            Étape {state.step + 1} / {STEPS.length}
          </span>

          <span className="stepCounter">
            {STEPS[state.step]}
          </span>
        </div>

        <div className="progressTrack">
          <div
            className="progressFill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="stepBar">
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: i <= state.step
                  ? "#185FA5"
                  : "var(--color-border-tertiary)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* AUTO SAVE */}
      <SavedBadge show={savedVisible} />

      {/* STEPS */}
      {state.step === 0 && (
        <Step1
          data={state.defunt}
          onChange={setDefunt}
          errors={errors}
        />
      )}

      {state.step === 1 && (
        <Step2
          data={state.heirs}
          onChange={setHeir}
          onAdd={addHeir}
          onRemove={removeHeir}
          errors={errors || {}}
        />
      )}

      {state.step === 2 && (
        <Step3
          data={state.assets}
          onChange={setAsset}
          onAdd={addAsset}
          onRemove={removeAsset}
          errors={errors || {}}
        />
      )}

      {state.step === 3 && (
        <Step4
          data={state.declarant}
          onChange={setDeclarant}
          errors={errors}
        />
      )}

      {state.step === 4 && (
        <Step5
          data={state}
          onCertChange={setCert}
        />
      )}

      {/* NAVIGATION */}
      {state.step < 4 && (
        <div className="nav">
          {state.step > 0 && (
            <button onClick={goBack} className="btnNav">
              ← Retour
            </button>
          )}

          <button
            onClick={goNext}
            className="btnNav btnPrimary"
          >
            Suivant →
          </button>
        </div>
      )}

      {state.step === 4 && (
        <div className="nav">
          <button onClick={goBack} className="btnNav">
            ← Retour
          </button>
        </div>
      )}
    </div>
  );
}

export default Succession;