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

  // Define searchable columns
  const searchableColumns = [
    {
      id: "name",
      title: "Name",
    },
    {
      id: "status",
      title: "Assessment Status",
      options: [
        {
          label: "Active",
          value: "Active"
        },
        {
          label: "Inactive",
          value: "Inactive"
        },
        {
          label: "Final",
          value: "Final"
        },
        {
          label: "Archived",
          value: "Archived"
        }
      ]
    }
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns({ assessmentType })}
        data={assessments}
        selectable={false}
        searchableColumns={searchableColumns}
        urlHeader={`/${assessmentType.id}/reports`}
      />
    </div>
  )
}
