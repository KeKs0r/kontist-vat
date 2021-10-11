export function Stat({
  value,
  title,
  description,
}: {
  value: string | number;
  title: string;
  description?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {description && <div className="stat-desc">{description}</div>}
    </div>
  );
}
