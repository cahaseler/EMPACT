"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { AssessmentUserResponse, Level, User } from "@/prisma/mssql/generated/client"

type AssessmentUserResponseWithUserAndLevel = AssessmentUserResponse & {
  user?: User,
  level?: Level
}

// Column definitions
export const columns: ColumnDef<AssessmentUserResponseWithUserAndLevel>[] = [
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
