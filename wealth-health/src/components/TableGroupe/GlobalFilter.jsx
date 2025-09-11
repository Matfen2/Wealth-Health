import { useEffect, useState } from "react";

export default function GlobalFilter({ value, onChange, delay = 180 }) {
  const [local, setLocal] = useState(value || "");

  useEffect(() => setLocal(value || ""), [value]);

  useEffect(() => {
    const id = setTimeout(() => onChange(local || undefined), delay);
    return () => clearTimeout(id);
  }, [local, delay, onChange]);

  return (
    <>
      <label className="lbl">Search:</label>
      <input
        className="inp"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Filter employees…"
        aria-label="Filter employees"
      />
    </>
  );
}
