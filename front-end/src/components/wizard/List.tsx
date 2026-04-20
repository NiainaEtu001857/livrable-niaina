import { getWizard } from "../../services/wizard.service";
import "../../styles/list.css";
import { useEffect, useState } from "react";

export default function List() {
    const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🚀 API CALL
  const fetchData = async () => {
    try {
    
      const data = await getWizard();
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur chargement");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

const { defunt, declarant, heirs, assets, certs } = data;

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="recapContainer">

      {/* HEADER */}
      <div className="recapHeader">
        <h2>📄 Récapitulatif de la succession</h2>
        <span className="badgeStep">Step {data.step}</span>
      </div>

      {/* DEFUNT */}
      <div className="card">
        <h3>👤 Défunt</h3>
        <p><b>Nom :</b> {defunt.nom} {defunt.prenom}</p>
        <p><b>Date naissance :</b> {new Date(defunt.dob).toLocaleDateString()}</p>
        <p><b>Date décès :</b> {new Date(defunt.dod).toLocaleDateString()}</p>
        <p><b>Commune :</b> {defunt.commune}</p>
      </div>

      {/* DECLARANT */}
      <div className="card">
        <h3>📌 Déclarant</h3>
        <p>{declarant.prenom} {declarant.nom}</p>
        <p>{declarant.email}</p>
        <p>{declarant.telephone}</p>
        <p>{declarant.adresse}</p>
        <span className="badge">{declarant.qualite}</span>
      </div>

      {/* HEIRS */}
      <div className="card">
        <h3>👨‍👩‍👧 Héritiers ({heirs.length})</h3>

        <div className="grid">
          {heirs.map((h, i) => (
            <div className="miniCard" key={i}>
              <p><b>{h.prenom} {h.nom}</b></p>
              <span className="tag">{h.lien}</span>
              <p className="small">
                {new Date(h.dob).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ASSETS */}
      <div className="card">
        <h3>🏠 Actifs</h3>

        <div className="grid">
          {assets.map((a, i) => (
            <div className="miniCard" key={i}>
              <p><b>{a.type}</b></p>
              <p>{a.valeur} €</p>
              <p className="small">{a.adresse}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CERTIFICATION */}
      <div className="card">
        <h3>✔ Certification</h3>

        <p className={certs.exact ? "ok" : "no"}>
          {certs.exact ? "✔ Informations exactes" : "✖ Non validé"}
        </p>

        <p className={certs.cgu ? "ok" : "no"}>
          {certs.cgu ? "✔ CGU acceptées" : "✖ CGU non acceptées"}
        </p>
      </div>

    </div>
  );
}
