import { memo, useEffect, useState } from "react";

function GlobalFilterBase({ value, onChange, placeholder = "Filter employees…" }) {
  const [v, setV] = useState(value ?? "");

  useEffect(() => setV(value ?? ""), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(v), 200);
    return () => clearTimeout(t);
  }, [v, onChange]);

  return (
    <input
      aria-label="Search"
      placeholder={placeholder}
      value={v}
      onChange={(e) => setV(e.target.value)}
      style={{ width: 260 }}
    />
  );
}
export default memo(GlobalFilterBase);
