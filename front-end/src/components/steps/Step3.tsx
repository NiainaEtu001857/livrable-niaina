import type { Asset } from "../../types";
import { fmtEur } from "../../utils/helpers";
import AssetBlock from "../ui/AssetBlock";
import { InfoBox } from "../ui/Box";
import Card from "../ui/Card";

type Props = {
  data: Asset[];
  onChange: (index: number, field: keyof Asset, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errors: Record<number, Partial<Record<keyof Asset, string>>>;
};

export default function Step3({
  data,
  onChange,
  onAdd,
  onRemove,
  errors,
}: Props) {
  const hasImmo = data.some((a) => a.type === "immo");

  const total = data.reduce((sum: number, a) => {
    const value =
      typeof a.valeur === "number"
        ? a.valeur
        : parseFloat(a.valeur || "0");

    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const showNotaire = hasImmo && total > 5000;

  return (
    <Card>
      <h2 className="stepTitle">Actifs de la succession</h2>

      {showNotaire && (
        <InfoBox>
          <strong className="infoTitle">
            Notaire obligatoire
          </strong>
          <p className="infoText">
            La succession comprend un bien immobilier et dépasse 5 000 €.
            Vous devez obligatoirement passer par un notaire.
          </p>
        </InfoBox>
      )}

      {data.map((a, i) => (
        <AssetBlock
          key={i}
          asset={a}
          index={i}
          onChange={(field, val) => onChange(i, field, val)}
          onRemove={() => onRemove(i)}
          errors={errors[i] || {}}
          canRemove={data.length > 1}
        />
      ))}

      <button className="btnAdd" onClick={onAdd}>
        + Ajouter un bien
      </button>

      {data.length > 0 && (
        <div className="totalBadge">
          <span className="totalLabel">Total estimé</span>
          <strong className="totalValue">
            {fmtEur(total)}
          </strong>
        </div>
      )}
    </Card>
  );
}