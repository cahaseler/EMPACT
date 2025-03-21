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
import { Assessment, AssessmentType } from "@/prisma/mssql/generated/client"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export function DataTable({
  assessments,
  assessmentType,
}: {
  readonly assessments: Assessment[]
  readonly assessmentType: AssessmentType
}) {
  const router = useRouter()

  return (
    <Table className="cursor-pointer dark:bg-transparent">
      <TableHeader>
        <TableRow>
          <TableHead>Project ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assessments.map((assessment: Assessment, key: number) => (
          <TableRow
            key={key}
            onClick={() =>
              router.push(`/${assessmentType.id}/reports/${assessment.id}`)
            }
          >
            <TableCell>{assessment.projectId}</TableCell>
            <TableCell>{assessment.name}</TableCell>
            <TableCell>{assessment.status}</TableCell>
            <TableCell>{assessment.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
