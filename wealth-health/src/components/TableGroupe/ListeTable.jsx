import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { usePageMeta } from "../../hooks/usePageMeta";
import { selEmployees, setEmployees } from "../../features/newEmploye/newEmployeeSlice";
import { COLUMNS } from "./columns";
import GlobalFilter from "./GlobalFilter";
import MOCK from "../../Moks/MOCK.json";
import "./table.css";

export default function ListeTable() {
  usePageMeta({
    title: "HRnet — Liste des employés",
    description: "Liste des employés HRnet : tri, filtre et pagination.",
  });

  const dispatch = useDispatch();
  const data = useSelector(selEmployees);

  // Seed si le store est vide
  useEffect(() => {
    if (!data?.length && Array.isArray(MOCK) && MOCK.length) {
      dispatch(setEmployees(MOCK));
    }
  }, [data?.length, dispatch]);

  const columns = useMemo(() => COLUMNS, []);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  // synchronise le pageSize UI → table state
  useEffect(() => table.setPageSize(pageSize), [pageSize, table]);

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <main className="container">
      <div className="searches">
        <div className="search-and-pagination">
          {/* Gauche : Search + PageSize */}
          <div className="search">
            <GlobalFilter value={globalFilter} onChange={setGlobalFilter} />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(+e.target.value)}
              aria-label="Rows per page"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  Show {n} / Page
                </option>
              ))}
            </select>
          </div>

          {/* Droite : Pagination */}
          <div className="pagination">
            <div className="pagination-page">
              <span>
                Page <strong>{pageIndex + 1}</strong> of <strong>{pageCount}</strong>
              </span>
              <span>
                <label htmlFor="goto">Go to page: </label>
                <input
                  id="goto"
                  type="number"
                  min="1"
                  value={pageIndex + 1}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(pageCount || 1, Number(e.target.value) || 1));
                    table.setPageIndex(v - 1);
                  }}
                  style={{ width: 56 }}
                />
              </span>
            </div>
            <div className="buttons">
              <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                {"<<"}
              </button>
              <button onClick={table.previousPage} disabled={!table.getCanPreviousPage()}>
                Previous
              </button>
              <button onClick={table.nextPage} disabled={!table.getCanNextPage()}>
                Next
              </button>
              <button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-group">
          <table>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => {
                    const canSort = h.column.getCanSort();
                    const sort = h.column.getIsSorted();
                    return (
                      <th
                        key={h.id}
                        scope="col"
                        onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                        style={{ cursor: canSort ? "pointer" : "default" }}
                        title={canSort ? "Click to sort" : undefined}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <span>
                          {sort === "asc" ? " ▲" : sort === "desc" ? " ▼" : canSort ? " ▲▼" : ""}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="table-message">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
