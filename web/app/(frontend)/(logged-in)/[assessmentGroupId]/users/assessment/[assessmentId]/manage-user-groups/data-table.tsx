"use client"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AssessmentUser,
  AssessmentUserGroup,
  User,
} from "@/prisma/mssql/generated/client"
import DataRow from "./data-row"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  groups,
}: {
  readonly groups: (AssessmentUserGroup & {
    assessmentUser: (AssessmentUser & { user: User })[]
  })[]
}) {
  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="table-fixed dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Group ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-48">Status</TableHead>
            <TableHead>Number of Assigned Users</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map(
            (
              group: AssessmentUserGroup & {
                assessmentUser: (AssessmentUser & { user: User })[]
              }
            ) => (
              <DataRow group={group} key={group.id} />
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
