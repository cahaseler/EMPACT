"use client"

import { useEffect, useState } from "react"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: {
    id: string
    title: string
    options: {
      label: string
      value: string
    }[]
  }[]
  searchableColumns?: {
    id: string
    title: string
  }[]
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Local state for the search input to debounce
  const [searchValue, setSearchValue] = useState<string>(
    (table.getColumn(searchableColumns[0]?.id)?.getFilterValue() as string) ??
      ""
  )

  // Debounce search input to avoid lag on every keystroke
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchableColumns.length > 0) {
        table.getColumn(searchableColumns[0].id)?.setFilterValue(searchValue)
      }
    }, 300) // 300ms debounce delay

    return () => clearTimeout(debounceTimeout)
  }, [searchValue, table, searchableColumns])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 && (
          <Input
            placeholder="Search users..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              column.options.length > 0 && (
                <DataTableFacetedFilter
                  key={column.id}
                  column={table.getColumn(column.id)}
                  title={column.title}
                  options={column.options}
                />
              )
          )}
        {isFiltered && (
          <Button
            variant="default"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-3 lg:px-4 text-white"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
