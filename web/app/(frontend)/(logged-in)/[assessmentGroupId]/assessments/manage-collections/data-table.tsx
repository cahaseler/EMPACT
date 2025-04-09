"use client"

import { Session } from "@/auth"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Assessment,
  AssessmentCollection,
  AssessmentCollectionUser,
  AssessmentType,
  User,
} from "@/prisma/mssql/generated/client"
import { isAdmin } from "../../../utils/permissions"
import DataRow from "./data-row"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  collections,
  assessmentType,
  session
}: {
  readonly collections: (AssessmentCollection & {
    assessments: Assessment[]
    assessmentCollectionUser: (AssessmentCollectionUser & { user: User })[]
  })[]
  readonly assessmentType: AssessmentType
  readonly session: Session | null
}) {
  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="table-fixed dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Collection ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Assessments</TableHead>
            <TableHead>Manager(s)</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map(
            async (
              collection: AssessmentCollection & {
                assessments: Assessment[]
                assessmentCollectionUser: (AssessmentCollectionUser & {
                  user: User
                })[]
              }
            ) => (
              <DataRow
                key={collection.id}
                collection={collection}
                assessmentType={assessmentType}
                isAdmin={isAdmin(session)}
              />
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
