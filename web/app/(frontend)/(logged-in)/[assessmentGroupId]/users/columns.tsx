"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Assessment, AssessmentType } from "@/prisma/mssql/generated/client"

// Column definitions
export function columns({
    assessmentType
}: {
    readonly assessmentType: AssessmentType
}): ColumnDef<Assessment>[] {
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
            }
        ]
    )
}
