"use client"

import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Assessment,
  AssessmentCollection,
  AssessmentType,
} from "@/prisma/mssql/generated/client"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function CollectionsTable({
  collections,
  assessmentType,
}: {
  readonly collections: (AssessmentCollection & { assessments: Assessment[] })[]
  readonly assessmentType: AssessmentType
}) {
  const router = useRouter()

  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="cursor-pointer dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead>Collection ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Asessments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map(
            (
              collection: AssessmentCollection & { assessments: Assessment[] },
              key: number
            ) => (
              <TableRow
                key={key}
                onClick={() =>
                  router.push(
                    `/${assessmentType.id}/users/collection/${collection.id}`
                  )
                }
              >
                <TableCell>{collection.id}</TableCell>
                <TableCell>{collection.name}</TableCell>
                <TableCell>
                  <ul className="list-none">
                    {collection.assessments.map((assessment: Assessment) => (
                      <li key={assessment.id}>{assessment.name}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
