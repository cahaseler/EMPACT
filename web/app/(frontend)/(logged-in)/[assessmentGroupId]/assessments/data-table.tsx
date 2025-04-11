"use client"

import { Session } from "@/auth"

import { DataTable } from "@/components/ui/data-table/data-table"
import {
  AssessmentType,
  Assessment,
  AssessmentUser
} from "@/prisma/mssql/generated/client"
import { columns } from "./columns"

export default function AssessmentsDataTable({
  assessments,
  assessmentType,
  session,
}: Readonly<{
  assessments: (Assessment & { assessmentUser: AssessmentUser[] })[]
  assessmentType: AssessmentType
  session: Session | null
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
        columns={columns({ assessmentType, session })}
        data={assessments}
        selectable={false}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        urlHeader={`/${assessmentType.id}/assessments`}
      />
    </div>
  )
}
