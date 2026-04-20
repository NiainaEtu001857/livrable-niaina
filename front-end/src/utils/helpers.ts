export const isValidDate = (s: string) => {
  if (!s) return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
};

export const isValidEmail = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const isMinor = (dob: string) => {
  if (!dob) return false;
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age < 18;
};

export const fmtEur = (n: number) =>
  (parseFloat(n.toString()) || 0).toLocaleString("fr-FR") + " €";