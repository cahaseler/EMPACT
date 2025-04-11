"use client"

import { DataTable } from "@/components/ui/data-table/data-table"
import {
  AssessmentPart,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Part,
  Permission,
  User
} from "@/prisma/mssql/generated/client"
import { columns } from "./columns"

export default function UsersDataTable({
  users,
  assessmentTypeId,
  groups,
  parts,
  permissions,
  canEdit,
  canEditPermissions
}: Readonly<{
  users: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: AssessmentUserResponse[]
    },
    assessmentUserGroup: AssessmentUserGroup | null,
    participantParts: AssessmentPart[],
    permissions: Permission[]
  })[]
  assessmentTypeId: number
  groups: AssessmentUserGroup[]
  parts: (AssessmentPart & { part: Part })[]
  permissions: Permission[]
  canEdit: boolean
  canEditPermissions: boolean
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
      id: "role",
      title: "Role",
      options: [
        {
          label: "Lead Facilitator",
          value: "Lead Facilitator",
        },
        {
          label: "Facilitator",
          value: "Facilitator",
        },
        {
          label: "Participant",
          value: "Participant",
        },
      ],
    },
    {
      id: "group",
      title: "Group",
      options: groups.map(
        group => ({
          label: group.name,
          value: group.name
        })
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns({
          assessmentTypeId,
          groups,
          parts,
          permissions,
          canEdit,
          canEditPermissions
        })}
        data={users}
        selectable={false}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
      />
    </div>
  )
}
