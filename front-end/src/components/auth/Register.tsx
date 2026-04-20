import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../ui/Inputs";
import { register } from "../../services/auth.service";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const setField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = () => {
    const err: any = {};

    if (!form.email) err.email = "Email requis";
    if (!form.password) err.password = "Mot de passe requis";
    else if (form.password.length < 6)
      err.password = "Minimum 6 caractères";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = await register(form.email, form.password);

      console.log("REGISTER SUCCESS:", data);

      // optionnel : redirect ou message
      alert("Compte créé avec succès");

    } catch (err: any) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2 className="authTitle">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="authForm">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            error={errors.email}
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={(v) => setField("password", v)}
            error={errors.password}
            required
          />

          <button className="authBtn">
            S'inscrire
          </button>
        </form>

        <p className="authFooter">
          Déjà un compte ?{" "}
          <Link to="/login" className="link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}