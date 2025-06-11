"use client"

import { Session } from "@/auth"

import { DataTable } from "@/components/ui/data-table/data-table"
import {
  AssessmentType,
  Assessment,
  AssessmentCollection,
  AssessmentPart,
  AssessmentUser,
  User
} from "@/prisma/mssql/generated/client"
import { columns } from "./columns"

export default function AssessmentsDataTable({
  assessments,
  assessmentType,
  collections,
  session,
}: Readonly<{
  assessments: (Assessment & {
    assessmentParts: AssessmentPart[],
    assessmentUser: (AssessmentUser & { user: User })[]
  })[]
  assessmentType: AssessmentType
  collections: AssessmentCollection[]
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

  // Define initial column visibility
  const initColumnVisibility = {
    id: true,
    projectId: true,
    name: true,
    status: true,
    location: false,
    completedDate: false,
    facilitators: true,
    actions: true
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns({ assessmentType, collections, session })}
        data={assessments}
        selectable={false}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        initColumnVisibility={initColumnVisibility}
        urlHeader={`/${assessmentType.id}/assessments`}
      />
    </div>
  )
}
