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
