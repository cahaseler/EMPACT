"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { FileChartColumn, SquarePen, Users } from "lucide-react"
import Link from "next/link"

import { Session } from "@/auth"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
    Assessment,
    AssessmentType,
    AssessmentUser
} from "@/prisma/mssql/generated/client"
import {
    canViewUsers,
    isAdmin,
    isLeadForAssessment,
    isManagerForCollection
} from "../../utils/permissions"
import ArchiveModule from "./archive-module"

// User action component for editing user details
function AssessmentActions({
    assessmentTypeId,
    assessment,
    session,
    assessmentUsers,
}: {
    readonly assessmentTypeId: number
    readonly assessment: Assessment
    readonly session: Session | null
    readonly assessmentUsers: AssessmentUser[]
}) {
    const permissions = session?.user?.assessmentUser.find(
        assessmentUser => assessmentUser.assessmentId === assessment.id
    )?.permissions
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

// Column definitions
export function columns({
    assessmentType,
    session
}: {
    readonly assessmentType: AssessmentType,
    readonly session: Session | null
}): ColumnDef<Assessment & { assessmentUser: AssessmentUser[] }>[] {
    return (
        [
            {
                accessorKey: "id",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="ID" />
                ),
                cell: ({ row }) => <div>{row.getValue("id")}</div>,
                enableHiding: false
            },
            {
                accessorKey: "projectId",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={`${assessmentType.projectType || "Project"} ID`} />
                ),
                cell: ({ row }) => <div>{row.getValue("projectId")}</div>,
                enableHiding: false
            },
            {
                accessorKey: "name",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Name" />
                ),
                cell: ({ row }) => <div>{row.getValue("name")}</div>,
                enableSorting: true,
                enableHiding: false
            },
            {
                accessorKey: "status",
                filterFn: 'includesStringSensitive',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Status" />
                ),
                cell: ({ row }) => <div>{row.getValue("status")}</div>
            },
            {
                accessorKey: "location",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Location" />
                ),
                cell: ({ row }) => <div>{row.getValue("location")}</div>
            },
            {
                accessorKey: "completedDate",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Completion Date" />
                ),
                cell: ({ row }) => <div>{row.original.completedDate ? format(row.getValue("completedDate"), "MM/dd/yyyy") : "N/A"}</div>,
                enableSorting: true
            },
            {
                id: "actions",
                cell: ({ row }) =>
                    <AssessmentActions
                        assessment={row.original}
                        assessmentTypeId={assessmentType.id}
                        session={session}
                        assessmentUsers={row.original.assessmentUser}
                    />,
            },
        ]
    )
}
