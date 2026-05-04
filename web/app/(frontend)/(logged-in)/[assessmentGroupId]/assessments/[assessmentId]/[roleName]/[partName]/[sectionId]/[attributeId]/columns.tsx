"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  AssessmentUserReconciliation,
  AssessmentUserResponse,
  Level,
  User
} from "@/prisma/mssql/generated/client"

type AssessmentUserResponseWithInfo = AssessmentUserResponse & {
  user?: User,
  level?: Level,
  reconciliation?: AssessmentUserReconciliation & { level?: Level }
}

const defaultColumns: ColumnDef<AssessmentUserResponseWithInfo>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("userId")}</div>,
    enableHiding: false
  },
  {
    accessorFn: (row) => `${row.user?.lastName}, ${row.user?.firstName}`,
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableHiding: false
  },
]

// Column definitions
export const columns: ColumnDef<AssessmentUserResponseWithInfo>[] = [
  ...defaultColumns,
  {
    accessorFn: (row) => row.level?.level,
    id: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => <div>{row.getValue("level")}</div>,
    enableHiding: false
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comments" />
    ),
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
    enableHiding: false
  },
]

// Column definitions for reconciliation
export const recColumns: ColumnDef<AssessmentUserResponseWithInfo>[] = [
  ...defaultColumns,
  {
    accessorFn: (row) => row.level?.level,
    id: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Initial Rating" />
    ),
    cell: ({ row }) => <div>{row.getValue("level")}</div>,
    enableHiding: false
  },
  {
    accessorFn: (row) => row.reconciliation ? row.reconciliation.level?.level : "--",
    id: "recLevel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reconciliation Rating" />
    ),
    cell: ({ row }) => <div>{row.getValue("recLevel")}</div>,
    enableHiding: false
  },
  {
    accessorFn: (row) => row.reconciliation && row.reconciliation.notes !== "" ? row.reconciliation.notes : row.notes,
    id: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comments" />
    ),
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
    enableHiding: false
  },
]
