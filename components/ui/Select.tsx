type Option = {
  label: string;
  value: string;
};
export function Select({
  value,
  options,
  label,
  onSelect,
}: {
  value: string;
  options: Option[];
  label: string;
  onSelect(value: string): void;
}) {
  return (
    <div className="form-control w-full max-w-xs">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <select
        className="select select-bordered w-full"
        onChange={(e) => onSelect(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} selected={value === o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
