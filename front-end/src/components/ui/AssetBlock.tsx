import Row from "../ui/Row";
import Input from "../ui/Inputs";
import Select from "../ui/Select";
import type { Asset } from "../../types";
import { ASSET_TYPES } from "../../constants";

type Props = {
  asset: Asset;
  index: number;
  onChange: (field: string, value: string) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
  canRemove: boolean;
};


export default function AssetBlock({
  asset,
  index,
  onChange,
  onRemove,
  errors,
  canRemove,
}: Props) {
  const isImmo = asset.type === "immo";

  return (
    <div className="subBlock">
      <div className="subBlockHeader">
        <span className="blockLabel">
          Bien {index + 1}
        </span>

        {canRemove && (
          <button
            onClick={onRemove}
            className="btnRemove"
            aria-label="Supprimer"
          >
            ✕
          </button>
        )}
      </div>

      <Row>
        <Select
          label="Type de bien"
          value={asset.type}
          onChange={(v) => onChange("type", v)}
          options={ASSET_TYPES}
          error={errors?.type}
          required
        />

        <Input
          label="Valeur estimée (€)"
          type="number"
          value={asset.valeur}
          onChange={(v) => onChange("valeur", v)}
          error={errors?.valeur}
          required
        />
      </Row>

      {isImmo && (
        <Input
          label="Adresse du bien"
          value={asset.adresse}
          onChange={(v) => onChange("adresse", v)}
          error={errors?.adresse}
          required
        />
      )}
    </div>
  );
}