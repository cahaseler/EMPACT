"use client"

import { DataTable } from "@/components/ui/data-table/data-table"

import {
  Assessment,
  AssessmentCollection,
  AssessmentType,
} from "@/prisma/mssql/generated/client"

import { columns } from "./collections-columns"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function CollectionsTable({
  collections,
  assessmentType,
}: {
  readonly collections: (AssessmentCollection & { assessments: Assessment[] })[]
  readonly assessmentType: AssessmentType
}) {
  // Define searchable columns
  const searchableColumns = [
    {
      id: "name",
      title: "Name",
    },
  ]

  return (
    <div className="space-y-4 list-none">
      <DataTable
        columns={columns}
        data={collections}
        selectable={false}
        searchableColumns={searchableColumns}
        urlHeader={`/${assessmentType.id}/users/collection`}
      />
    </div>
  )
}