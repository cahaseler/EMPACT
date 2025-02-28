"use client"
import { AssessmentType, Assessment } from "@/prisma/mssql/generated/client"
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
    assessmentType,
}: {
    readonly assessments: Assessment[], 
    readonly assessmentType: AssessmentType,
}) {
    const router = useRouter()

    return (
        <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
                <div className="space-y-4 max-lg:ml-2">
                    <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name} Reports</h1>
                    <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                        Select an assessment from the list below to view its report.
                    </p>
                </div>
            </section>
            <section className="mb-16">
                <div className="space-y-4">
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
                            <TableRow key={key} onClick={() =>
                                router.push(`/${assessmentType.id}/reports/${assessment.id}`)
                            }>
                                <TableCell>{assessment.projectId}</TableCell>
                                <TableCell>{assessment.name}</TableCell>
                                <TableCell>{assessment.status}</TableCell>
                                <TableCell>{assessment.location}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </div>
    )
}