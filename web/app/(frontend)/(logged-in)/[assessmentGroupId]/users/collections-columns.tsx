"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { AssessmentCollection, Assessment } from "@/prisma/mssql/generated/client"

type AssessmentCollectionWithAssessments = AssessmentCollection & {
  assessments: Assessment[]
}

// Column definitions
export const columns: ColumnDef<AssessmentCollectionWithAssessments>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Collection ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableHiding: false
  },
  {
    accessorFn: (row) => row.assessments.map(
      (assessment: Assessment) => (
        <li key={assessment.id}>{assessment.name}</li>
      )
    ),
    id: "assessments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assessments" />
    ),
    cell: ({ row }) => <div>{row.getValue("assessments")}</div>,
    enableHiding: false
  },
]
