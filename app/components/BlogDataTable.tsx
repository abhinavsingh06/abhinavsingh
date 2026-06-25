"use client";

export interface BlogTableColumn {
  id: string;
  label: string;
  mono?: boolean;
  accent?: boolean;
  emphasis?: boolean;
}

export interface BlogTableRow {
  id: string;
  cells: Record<string, string>;
  highlight?: boolean;
}

interface BlogDataTableProps {
  columns: BlogTableColumn[];
  rows: BlogTableRow[];
  footnote?: string;
}

function CellValue({
  value,
  mono,
  accent,
  emphasis,
}: {
  value: string;
  mono?: boolean;
  accent?: boolean;
  emphasis?: boolean;
}) {
  const isComplexity = /^O\(.+\)(\*)?$/.test(value.trim());

  return (
    <span
      className={
        emphasis
          ? "text-sm font-semibold text-[var(--fg)]"
          : mono || isComplexity
            ? `font-mono text-sm ${accent || isComplexity ? "text-[var(--accent)]" : "text-[var(--fg)]"}`
            : "text-sm text-[var(--fg-2)]"
      }>
      {value}
    </span>
  );
}

export default function BlogDataTable({
  columns,
  rows,
  footnote,
}: BlogDataTableProps) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-2)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--bg)]">
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className="px-4 py-3 font-mono-xs font-semibold uppercase tracking-wide text-[var(--muted)] sm:px-5">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-[var(--line)] last:border-b-0 transition-colors ${
                  row.highlight
                    ? "bg-[var(--accent-soft)]/30"
                    : index % 2 === 0
                      ? "bg-transparent"
                      : "bg-[var(--bg)]/40"
                } hover:bg-[var(--accent-soft)]/20`}>
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className="px-4 py-3.5 sm:px-5">
                    <CellValue
                      value={row.cells[col.id] ?? ""}
                      mono={col.mono}
                      accent={col.accent}
                      emphasis={col.emphasis}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && (
        <p className="border-t border-[var(--line)] px-4 py-3 font-mono-xs text-[var(--muted)] sm:px-5">
          {footnote}
        </p>
      )}
    </div>
  );
}
