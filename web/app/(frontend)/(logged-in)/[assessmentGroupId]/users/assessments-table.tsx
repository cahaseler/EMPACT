"use client"

import { DataTable } from "@/components/ui/data-table/data-table"
import { AssessmentType, Assessment } from "@/prisma/mssql/generated/client"
import { columns } from "./columns"

export default function AssessmentsDataTable({
  assessments,
  assessmentType
}: Readonly<{
  assessments: Assessment[]
  assessmentType: AssessmentType
}>) {
  // Define searchable and filterable columns
  const searchableColumns = [
    {
      id: "name",
      title: "Name",
    },
  ]

  const filterableColumns = [
    {
      id: "status",
      title: "Assessment Status",
      options: [
        {
          label: "Planned",
          value: "Planned",
        },
        {
          label: "Active",
          value: "Active",
        },
        {
          label: "Inactive",
          value: "Inactive",
        },
        {
          label: "Final",
          value: "Final",
        },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns({ assessmentType })}
        data={assessments}
        selectable={false}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        urlHeader={`/${assessmentType.id}/users/assessment`}
      />
    </div>
  )
}
