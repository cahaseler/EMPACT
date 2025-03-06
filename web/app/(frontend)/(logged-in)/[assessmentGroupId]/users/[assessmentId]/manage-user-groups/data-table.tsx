"use client"
import { 
    User, 
    AssessmentUserGroup,
    AssessmentUser
} from "@/prisma/mssql/generated/client"

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import DataRow from "./data-row"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({ groups }: {
    readonly groups: (AssessmentUserGroup & { assessmentUser: (AssessmentUser & { user: User })[] } )[]
}) {
    return (
        <Table className="table-fixed dark:bg-transparent">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-32">Group ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Number of Assigned Users</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {groups.map((group: AssessmentUserGroup & { assessmentUser: (AssessmentUser & { user: User })[] }) => 
                    <DataRow group={group} />
                )}
            </TableBody>
        </Table>
    )
}