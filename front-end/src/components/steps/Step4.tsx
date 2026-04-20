import type { Declarant, Defunt } from "../../types";
import Input from "../ui/Inputs";
import Card from "../ui/Card";
import Row from "../ui/Row";
import Select from "../ui/Select";
import { QUALITES } from "../../constants";

type Props = {
  data: Declarant;
  onChange: (field: keyof Defunt, value: string) => void;
  errors: Record<string, string>;
};

export default function Step4({ data, onChange, errors }: Props) {
  return (
    <Card>
    <h2 className="stepTitle">Coordonnées du déclarant</h2>
    <Row>
      <Input label="Nom" value={data.nom} onChange={(v) => onChange("nom", v)} error={errors.nom} required />
      <Input label="Prénom" value={data.prenom} onChange={(v) => onChange("prenom", v)} error={errors.prenom} required />
    </Row>
    <Input label="Adresse" value={data.adresse} onChange={(v) => onChange("adresse", v)} error={errors.adresse} required />
    <Row>
      <Input label="Email" type="email" value={data.email} onChange={(v) => onChange("email", v)} error={errors.email} required />
      <Input label="Téléphone" type="tel" value={data.telephone} onChange={(v) => onChange("telephone", v)} error={errors.telephone} required />
    </Row>
    <Select
      label="Qualité"
      value={data.qualite}
      onChange={(v) => onChange("qualite", v)}
      options={QUALITES}
      error={errors.qualite}
      required
    />
  </Card>
  );
}