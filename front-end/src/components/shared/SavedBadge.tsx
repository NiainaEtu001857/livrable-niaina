type SavedBadgeProps = {
  show: boolean;
};

export default function SavedBadge({ show }: SavedBadgeProps) {
  return (
    <div className={`savedBadge ${show ? "show" : ""}`}>
      ✓ Progression sauvegardée
    </div>
  );
}