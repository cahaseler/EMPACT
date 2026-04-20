"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  selectable?: boolean
  initColumnVisibility?: VisibilityState
  urlHeader?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  selectable = true,
  initColumnVisibility = {},
  urlHeader
}: DataTableProps<TData, TValue>) {
  const router = useRouter()

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initColumnVisibility)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: selectable,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={urlHeader && "cursor-pointer"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} onClick={() => {
                      if (urlHeader && !cell.id.includes("select") && !cell.id.includes("actions")) {
                        router.push(`${urlHeader}/${row.getValue("id")}`)
                      }
                    }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} selectable={selectable} />
    </div>
  )
}