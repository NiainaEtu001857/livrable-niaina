import { useState } from "react";
import "../../styles/auth.css";
import Input from "../ui/Inputs";
import { Link, redirect } from "react-router-dom";
import { login } from "../../services/auth.service";
import { setToken } from "../../utils/token";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});

  const setField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = () => {
    const err: any = {};

    if (!form.email) err.email = "Email requis";
    if (!form.password) err.password = "Mot de passe requis";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const data = await login(form.email, form.password);

    console.log("LOGIN SUCCESS:", data);

    // 💾 stocker le token
    setToken(data.token);

    alert("Connexion réussie");

    redirect ("/dashboard");
    // navigator("/dashboard");

  } catch (err: any) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Erreur login");
  }
};

  return (
    <div className="authPage">
      <div className="authCard">
        <h2 className="authTitle">Connexion</h2>

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
            Se connecter
          </button>
        </form>

        <p className="authFooter">
          Pas de compte ? 
          <Link to="/register" className="link">
                Créer un compte
            </Link>
        </p>
      </div>
    </div>
  );
}