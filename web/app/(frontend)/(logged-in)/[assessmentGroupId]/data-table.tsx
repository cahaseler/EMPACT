"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useRouter } from "next/navigation"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export function DataTable({
    assessments, 
    assessmentCollectionId
}: {
    assessments: any[], 
    assessmentCollectionId: number
}) {
    const router = useRouter()

    return (
        <Table className="cursor-pointer dark:bg-transparent">
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Completion Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {assessments.map((assessment, key) => (
                <TableRow key={key} onClick={() =>
                    router.push(`/${assessmentCollectionId}/${assessment.id}`)
                }>
                    <TableCell>{assessment.name}</TableCell>
                    <TableCell>{assessment.status}</TableCell>
                    <TableCell>{assessment.type}</TableCell>
                    <TableCell>{assessment.completionDate || "N/A"}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}