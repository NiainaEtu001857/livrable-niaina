import { useState } from "react";
import type { WizardState } from "../types";

export function useSuccession(initialState: WizardState) {
  const [state, setState] = useState(initialState);

  const setDefunt = (field: string, val: string) => {
    setState((s) => ({
      ...s,
      defunt: { ...s.defunt, [field]: val },
    }));
  };

  return {
    state,
    setState,
    setDefunt,
  };
}