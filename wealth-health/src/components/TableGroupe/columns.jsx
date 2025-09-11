// Parser date robuste: "yyyy/MM/dd" ou "yyyy-MM-dd" ou "dd/MM/yyyy"
const parseDate = (val) => {
  if (!val) return NaN;
  const s = String(val);
  // dd/MM/yyyy -> yyyy-MM-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/");
    return new Date(`${y}-${m}-${d}`).getTime();
  }
  // yyyy/MM/dd -> yyyy-MM-dd
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(s)) {
    return new Date(s.replaceAll("/", "-")).getTime();
  }
  return new Date(s).getTime();
};

const dateSort = (rowA, rowB, id) => {
  const a = parseDate(rowA.getValue(id));
  const b = parseDate(rowB.getValue(id));
  return (a || 0) - (b || 0);
};

const numSort = (rowA, rowB, id) => {
  const a = Number(rowA.getValue(id) ?? 0);
  const b = Number(rowB.getValue(id) ?? 0);
  return a - b;
};

const fmtDate = (val) => {
  const t = parseDate(val);
  if (!t || Number.isNaN(t)) return "";
  const d = new Date(t);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
};

export const COLUMNS = [
  { header: "Id", accessorKey: "id", sortingFn: numSort, size: 80 },
  { header: "First Name", accessorKey: "firstname" },
  { header: "Last Name", accessorKey: "lastname" },
  { header: "Date of Birth", accessorKey: "datebirth", sortingFn: dateSort,
    cell: (info) => fmtDate(info.getValue()) },
  { header: "Departament", accessorKey: "departament" }, // orthographe conforme à tes données
  { header: "Start Date", accessorKey: "startdate", sortingFn: dateSort,
    cell: (info) => fmtDate(info.getValue()) },
  { header: "Street", accessorKey: "street" },
  { header: "City", accessorKey: "city" },
  { header: "State", accessorKey: "countrystate", size: 110 },
  { header: "Zipcode", accessorKey: "zipcode", sortingFn: numSort, size: 110 },
];
