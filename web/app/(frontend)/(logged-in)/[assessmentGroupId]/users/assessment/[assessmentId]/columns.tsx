"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

import {
    AssessmentPart,
    AssessmentUser,
    AssessmentUserGroup,
    AssessmentUserResponse,
    Part,
    Permission,
    User
} from "@/prisma/mssql/generated/client"

import EditModule from "./edit-module"
import DeleteModule from "./delete-module"

// The type for our assessment user data that includes user info, participant parts, and permissions
export type AssessmentUserWithUserInfo = AssessmentUser & {
    user: User & {
        assessmentUserResponse: AssessmentUserResponse[]
    },
    assessmentUserGroup: AssessmentUserGroup | null,
    participantParts: AssessmentPart[],
    permissions: Permission[]
}

// User action component for editing user details
export function UserActions({
    user,
    assessmentTypeId,
    groups,
    parts,
    permissions,
    canEdit,
    canEditPermissions
}: {
    readonly user: AssessmentUserWithUserInfo
    readonly assessmentTypeId: number
    readonly groups: AssessmentUserGroup[]
    readonly parts: (AssessmentPart & { part: Part })[]
    readonly permissions: Permission[]
    readonly canEdit: boolean
    readonly canEditPermissions: boolean
}) {
    return (
        <div className="grid grid-cols-2 gap-2 w-20">
            {canEdit && <>
                <EditModule
                    assessmentUser={user}
                    groups={groups}
                    parts={parts}
                    permissions={permissions}
                    canEditPermissions={canEditPermissions}
                />
                <DeleteModule
                    assessmentUser={user}
                    assessmentTypeId={assessmentTypeId}
                    assessmentId={user.assessmentId}
                />
            </>}
        </div>
    )
}

// Column definitions
export function columns({
    assessmentTypeId,
    groups,
    parts,
    permissions,
    canEdit,
    canEditPermissions
}: {
    readonly assessmentTypeId: number
    readonly groups: AssessmentUserGroup[]
    readonly parts: (AssessmentPart & { part: Part })[]
    readonly permissions: Permission[]
    readonly canEdit: boolean
    readonly canEditPermissions: boolean
}): ColumnDef<AssessmentUserWithUserInfo>[] {
    return [
        {
            accessorFn: (row) => row.user.id,
            id: "userId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="User ID" />
            ),
            cell: ({ row }) => <div>{row.getValue("userId")}</div>,
            enableHiding: false,
        },
        {
            accessorFn: (row) => `${row.user.lastName}, ${row.user.firstName}`,
            id: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
            enableSorting: true,
            enableHiding: false,
        },
        {
            accessorFn: (row) => row.user.email,
            id: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => <div>{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Role" />
            ),
            cell: ({ row }) => <div>{row.getValue("role")}</div>,
            enableHiding: false,
        },
        {
            accessorFn: (row) => row.assessmentUserGroup ? row.assessmentUserGroup.name : "N/A",
            id: "group",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Group" />
            ),
            cell: ({ row }) => <div>{row.getValue("group")}</div>,
        },
        {
            id: "actions",
            cell: ({ row }) =>
                <UserActions
                    user={row.original}
                    assessmentTypeId={assessmentTypeId}
                    groups={groups}
                    parts={parts}
                    permissions={permissions}
                    canEdit={canEdit}
                    canEditPermissions={canEditPermissions}
                />,
        },
    ]
}