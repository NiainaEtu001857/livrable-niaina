import type { Defunt } from "../../types";
import Input from "../ui/Inputs";
import Card from "../ui/Card";
import Row from "../ui/Row";

type Props = {
  data: Defunt;
  onChange: (field: keyof Defunt, value: string) => void;
  errors: Record<string, string>;
};

export default function Step1({ data, onChange, errors }: Props) {
  return (
    <Card>
    <h2 className="stepTitle">Informations sur le défunt</h2>
    <Row>
      <Input label="Nom" value={data.nom} onChange={(v) => onChange("nom", v)} error={errors.nom} required />
      <Input label="Prénom" value={data.prenom} onChange={(v) => onChange("prenom", v)} error={errors.prenom} required />
    </Row>
    <Row>
      <Input label="Date de naissance" type="date" value={data.dob} onChange={(v) => onChange("dob", v)} error={errors.dob} required />
      <Input label="Date de décès" type="date" value={data.dod} onChange={(v) => onChange("dod", v)} error={errors.dod} required />
    </Row>
    <Input label="Commune de décès" value={data.commune} onChange={(v) => onChange("commune", v)} error={errors.commune} required />
  </Card>
  );
}