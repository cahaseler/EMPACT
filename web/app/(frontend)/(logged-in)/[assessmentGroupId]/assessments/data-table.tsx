"use client"

import { format } from "date-fns"
import { FileChartColumn, SquarePen, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Session } from "@/auth"
import { Button } from "@/components/ui/button"
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
  AssessmentType,
  AssessmentUser,
  Permission,
} from "@/prisma/mssql/generated/client"
import {
  canViewUsers,
  isAdmin,
  isLeadForAssessment,
  isManagerForCollection,
} from "../../utils/permissions"
import ArchiveModule from "./archive-module"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  assessments,
  assessmentType,
  session,
}: {
  readonly assessments: (Assessment & { assessmentUser: AssessmentUser[] })[]
  readonly assessmentType: AssessmentType
  readonly session: Session | null
}) {
  const router = useRouter()
  return (
    <Table className="cursor-pointer dark:bg-transparent">
      <TableHeader>
        <TableRow>
          <TableHead>{assessmentType.projectType || "Project"} ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Completion Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assessments.map((assessment: Assessment & { assessmentUser: AssessmentUser[] }, key: number) => {
          const permissions = session?.user?.assessmentUser.find(assessmentUser =>
            assessmentUser.assessmentId === assessment.id
          )?.permissions
          return (
            <TableRow key={key}>
              <TableCell onClick={() =>
                router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
              }>
                {assessment.projectId}
              </TableCell>
              <TableCell onClick={() =>
                router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
              }>
                {assessment.name}
              </TableCell>
              <TableCell onClick={() =>
                router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
              }>
                {assessment.status}
              </TableCell>
              <TableCell onClick={() =>
                router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
              }>
                {assessment.location}
              </TableCell>
              <TableCell onClick={() =>
                router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
              }>
                {assessment.status === "Final" && assessment.completedDate ? format(assessment.completedDate, "MM/dd/yyyy") : "N/A"}
              </TableCell>
              <TableCell>
                <AssessmentActions
                  assessmentTypeId={assessmentType.id}
                  assessment={assessment}
                  session={session}
                  permissions={permissions}
                  assessmentUsers={assessment.assessmentUser}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function AssessmentActions({
  assessmentTypeId,
  assessment,
  session,
  permissions,
  assessmentUsers,
}: {
  readonly assessmentTypeId: number
  readonly assessment: Assessment
  readonly session: Session | null
  readonly permissions: Permission[] | undefined
  readonly assessmentUsers: AssessmentUser[]
}) {
  const canEdit =
    isAdmin(session) ||
    isManagerForCollection(session, assessment.assessmentCollectionId) ||
    isLeadForAssessment(session, assessment.id.toString()) ||
    permissions?.find((permission) => permission.name === "Edit assessment") !==
    undefined
  const canView = canViewUsers(session)
  const canArchive =
    isAdmin(session) ||
    isManagerForCollection(session, assessment.assessmentCollectionId) ||
    permissions?.find(
      (permission) => permission.name === "Archive assessment"
    ) !== undefined
  return (
    <div className="grid grid-cols-2 gap-2 w-20">
      {canEdit && (
        <Link
          href={`/${assessmentTypeId}/assessments/${assessment.id}/edit-assessment`}
        >
          <Button size="icon">
            <SquarePen className="w-5 h-5 text-white" />
          </Button>
        </Link>
      )}
      <Link href={`/${assessmentTypeId}/reports/${assessment.id}`}>
        <Button size="icon">
          <FileChartColumn className="w-5 h-5 text-white" />
        </Button>
      </Link>
      {canView && (
        <Link href={`/${assessmentTypeId}/users/assessment/${assessment.id}`}>
          <Button size="icon">
            <Users className="w-5 h-5 text-white" />
          </Button>
        </Link>
      )}
      {canArchive && (
        <ArchiveModule
          assessment={assessment}
          assessmentTypeId={assessmentTypeId}
          assessmentUsers={assessmentUsers}
          buttonType="icon"
        />
      )}
    </div>
  )
}
