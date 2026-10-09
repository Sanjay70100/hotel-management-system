import type { ReactNode } from "react";

import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

import "./Table.css";

export interface TableColumn<T> {
  key: string;
  title: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  loading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

const Table = <T,>({
  columns,
  data,
  getRowKey,
  loading = false,
  emptyTitle = "No Records Found",
  emptyMessage = "There is no data to display.",
  onRowClick,
}: TableProps<T>) => {
  if (loading) {
    return <LoadingSpinner message="Loading records..." />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return (
    <div className="app-table-container">
      <table className="app-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.className}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={
                onRowClick
                  ? () => onRowClick(row)
                  : undefined
              }
              className={
                onRowClick
                  ? "app-table-row-clickable"
                  : ""
              }
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={column.className}
                >
                  {column.render
                    ? column.render(row)
                    : String(
                        (
                          row as Record<string, unknown>
                        )[column.key] ?? "-"
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;