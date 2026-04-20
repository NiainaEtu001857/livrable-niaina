import Card from "../ui/Card";
import Row from "../ui/Row";
import Input from "../ui/Inputs";
import Select from "../ui/Select";
import { LIENS } from "../../constants";
import type { Heir } from "../../types";

// utils simple dans le même fichier
const isMinor = (dob: string) => {
  if (!dob) return false;
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age < 18;
};

type Props = {
  data: Heir[];
  onChange: (index: number, field: string, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<number, Record<string, string>>;
};

export default function Step2({
  data,
  onChange,
  onAdd,
  onRemove,
  errors,
}: Props) {
  const hasMinor = data.some((h) => isMinor(h.dob));

  return (
    <Card>
      <h2 className="stepTitle">
        Héritiers ({data.length})
      </h2>

      {hasMinor && (
        <div className="warnBox">
          <strong>Attention — héritier mineur détecté</strong>
          <p>
            Un représentant légal (tuteur ou administrateur légal)
            doit être désigné.
          </p>
        </div>
      )}

      {data.map((heir, i) => (
        <div key={i} className="subBlock">
          {/* HEADER */}
          <div className="subBlockHeader">
            <span className="blockLabel">
              Héritier {i + 1}
            </span>

            {data.length > 1 && (
              <button
                className="btnRemove"
                onClick={() => onRemove(i)}
              >
                ✕
              </button>
            )}
          </div>

          {/* FORM */}
          <Row>
            <Input
              label="Nom"
              value={heir.nom}
              onChange={(v) => onChange(i, "nom", v)}
              error={errors[i]?.nom}
              required
            />

            <Input
              label="Prénom"
              value={heir.prenom}
              onChange={(v) => onChange(i, "prenom", v)}
              error={errors[i]?.prenom}
              required
            />
          </Row>

          <Row>
            <Select
              label="Lien de parenté"
              value={heir.lien}
              onChange={(v) => onChange(i, "lien", v)}
              options={LIENS}
              error={errors[i]?.lien}
              required
            />

            <Input
              label="Date de naissance"
              type="date"
              value={heir.dob}
              onChange={(v) => onChange(i, "dob", v)}
              error={errors[i]?.dob}
              required
            />
          </Row>

          {isMinor(heir.dob) && (
            <div className="warnBox small">
              Héritier mineur — représentant légal requis
            </div>
          )}
        </div>
      ))}

      {data.length < 6 && (
        <button className="btnAdd" onClick={onAdd}>
          + Ajouter un héritier
        </button>
      )}
    </Card>
  );
}