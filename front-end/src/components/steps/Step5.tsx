import type { Defunt, Asset, Heir, Declarant, Certs } from "../../types";
import Card from "../ui/Card";

type Props = {
  data: {
    defunt: Defunt;
    heirs: Heir[];
    assets: Asset[];
    declarant: Declarant;
    certs: {
      exact: boolean;
      cgu: boolean;
    };
  };
  onCertChange: (certs: Certs) => Ce;
};

const RecapRow = ({ label, value }: any) => (
  <div className="recapRow">
    <span className="recapKey">{label}</span>
    <span className="recapVal">{value}</span>
  </div>
);

const RecapSection = ({ title, children }: any) => (
  <div className="recapSection">
    <div className="recapLabel">{title}</div>
    {children}
  </div>
);



export default function Step5({ data, onCertChange }: Props) {
  const { defunt, heirs, assets, declarant, certs } = data;

  const total = assets.reduce((s, a) => {
    const val =
      typeof a.valeur === "number"
        ? a.valeur
        : parseFloat(a.valeur || "0");
    return s + (isNaN(val) ? 0 : val);
  }, 0);

  const canPay = certs.exact && certs.cgu;

  return (
    <>
      <Card>
        <h2 className="stepTitle">Récapitulatif complet</h2>

        <RecapSection title="Défunt">
          <RecapRow
            label="Identité"
            value={`${defunt.prenom} ${defunt.nom}`}
          />
          <RecapRow label="Né(e) le" value={defunt.dob} />
          <RecapRow label="Décédé(e) le" value={defunt.dod} />
          <RecapRow label="Commune" value={defunt.commune} />
        </RecapSection>

        <RecapSection title={`Héritiers (${heirs.length})`}>
          {heirs.map((h, i) => (
            <RecapRow
              key={i}
              label={`Héritier ${i + 1}`}
              value={`${h.prenom} ${h.nom} — ${h.lien}`}
            />
          ))}
        </RecapSection>

        <RecapSection title="Actifs">
          {assets.map((a, i) => (
            <RecapRow
              key={i}
              label={a.type}
              value={`${a.valeur} €${a.adresse ? " — " + a.adresse : ""}`}
            />
          ))}

          <div className="totalBadge">
            <span className="totalLabel">Total estimé</span>
            <strong className="totalValue">{total} €</strong>
          </div>
        </RecapSection>

        <RecapSection title="Déclarant">
          <RecapRow
            label="Identité"
            value={`${declarant.prenom} ${declarant.nom}`}
          />
          <RecapRow label="Adresse" value={declarant.adresse} />
          <RecapRow label="Email" value={declarant.email} />
          <RecapRow label="Téléphone" value={declarant.telephone} />
          <RecapRow label="Qualité" value={declarant.qualite} />
        </RecapSection>
      </Card>

      <Card>
        <h2 className="stepTitleSmall">Validation</h2>

        <label className="checkRow">
          <input
            type="checkbox"
            checked={certs.exact}
            onChange={(e) =>
              onCertChange("exact", e.target.checked)
            }
          />
          <span>
            Je certifie l'exactitude des informations saisies.
          </span>
        </label>

        <label className="checkRow">
          <input
            type="checkbox"
            checked={certs.cgu}
            onChange={(e) =>
              onCertChange("cgu", e.target.checked)
            }
          />
          <span>
            J'accepte les conditions générales d'utilisation.
          </span>
        </label>

        <button
          className={`btnPay ${!canPay ? "disabled" : ""}`}
          disabled={!canPay}
          onClick={() =>
            console.log("DATA TO SUBMIT:", data)
          }
        >
          Procéder au paiement
        </button>
      </Card>
    </>
  );
}