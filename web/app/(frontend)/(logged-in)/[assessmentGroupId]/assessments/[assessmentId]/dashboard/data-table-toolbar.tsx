"use client"

import { Table } from "@tanstack/react-table"

import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const hidableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  return (
    <div className="flex items-center justify-end"> {/* Changed justify-between to justify-end */}
      {/* Removed the div containing search, filters, and reset button */}
      {hidableColumns.length > 0 && <DataTableViewOptions table={table} />}
    </div>
  )
}