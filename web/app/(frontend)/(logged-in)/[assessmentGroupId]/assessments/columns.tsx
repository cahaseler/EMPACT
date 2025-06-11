"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { FileChartColumn, Users } from "lucide-react"
import Link from "next/link"

import { Session } from "@/auth"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    Assessment,
    AssessmentCollection,
    AssessmentPart,
    AssessmentType,
    AssessmentUser,
    User
} from "@/prisma/mssql/generated/client"
import {
    canViewUsers,
    isAdmin,
    isCollectionManager,
    isLeadForAssessment,
    isManagerForCollection
} from "../../utils/permissions"

import ArchiveModule from "./archive-module"
import EditModule from "./edit-module"
import SubmitModule from "./submit-module"

// User action component for editing user details
function AssessmentActions({
    assessmentType,
    assessment,
    collections,
    session
}: {
    readonly assessmentType: AssessmentType
    readonly assessment: Assessment & { assessmentParts: AssessmentPart[] }
    readonly collections: AssessmentCollection[]
    readonly session: Session | null
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
    const canEditCollection = isAdmin(session) || isCollectionManager(session)
    const canEditStatus =
        isAdmin(session) ||
        isManagerForCollection(session, assessment.assessmentCollectionId) ||
        isLeadForAssessment(session, assessment.id.toString())
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
                <EditModule
                    assessmentType={assessmentType}
                    assessment={assessment}
                    assessmentCollections={collections}
                    canEditCollection={canEditCollection}
                    canEditStatus={canEditStatus}
                    buttonType="icon"
                />
            )}
            <Link href={`/${assessmentType.id}/reports/${assessment.id}`}>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon">
                                <FileChartColumn className="w-5 h-5 text-white" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-center">
                            View Assessment Reports
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Link>
            {canView && (
                <Link href={`/${assessmentType.id}/users/assessment/${assessment.id}`}>
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon">
                                    <Users className="w-5 h-5 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-center">
                                Manage Assessment Users
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Link>
            )}
            {canEditStatus && assessment.status === "Active" && (
                <SubmitModule
                    assessment={assessment}
                    buttonType="icon"
                />
            )}
            {canArchive && assessment.status !== "Active" && (
                <ArchiveModule
                    assessment={assessment}
                    assessmentTypeId={assessmentType.id}
                    buttonType="icon"
                />
            )}
        </div>
    )
}

// Column definitions
export function columns({
    assessmentType,
    collections,
    session
}: {
    readonly assessmentType: AssessmentType,
    readonly collections: AssessmentCollection[],
    readonly session: Session | null
}): ColumnDef<Assessment & {
    assessmentParts: AssessmentPart[],
    assessmentUser: (AssessmentUser & { user: User })[]
}>[] {
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
                enableSorting: true,
            },
            {
                id: "facilitators",
                accessorFn: (row) => {
                    const facilitators = row.assessmentUser.filter((assessmentUser) =>
                        assessmentUser.role === "Facilitator" ||
                        assessmentUser.role === "Lead Facilitator"
                    )
                    if (facilitators.length > 0) {
                        return facilitators.map((facilitator) =>
                            <li key={facilitator.id}>
                                {facilitator.user.lastName}, {facilitator.user.firstName}
                            </li>
                        )
                    }
                    return "N/A"
                },
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Facilitator(s)" />
                ),
                cell: ({ row }) => <div><ul className="list-none">{row.getValue("facilitators")}</ul></div>
            },
            {
                id: "actions",
                cell: ({ row }) =>
                    <AssessmentActions
                        assessment={row.original}
                        assessmentType={assessmentType}
                        collections={collections}
                        session={session}
                    />,
            },
        ]
    )
}
