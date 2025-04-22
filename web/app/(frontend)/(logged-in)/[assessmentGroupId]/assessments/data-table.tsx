"use client"

import { Session } from "@/auth"

import { DataTable } from "@/components/ui/data-table/data-table"
import {
  AssessmentType,
  Assessment,
  AssessmentUser,
  User
} from "@/prisma/mssql/generated/client"
import { columns } from "./columns"
import { TrendingUpDown } from "lucide-react"

export default function AssessmentsDataTable({
  assessments,
  assessmentType,
  session,
}: Readonly<{
  assessments: (Assessment & { assessmentUser: (AssessmentUser & { user: User })[] })[]
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
        columns={columns({ assessmentType, session })}
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
