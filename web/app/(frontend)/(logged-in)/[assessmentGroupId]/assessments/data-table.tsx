"use client"
import { AssessmentType, Assessment } from "@/prisma/mssql/generated/client"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import NotFound from "@/app/(frontend)/components/notFound"

import { useRouter } from "next/navigation"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export function DataTable({
    assessments, 
    assessmentType,
    canAdd
}: {
    readonly assessments: Assessment[], 
    readonly assessmentType: AssessmentType | null,
    readonly canAdd: boolean
}) {
    const router = useRouter()

    if(assessmentType) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4 max-lg:ml-2">
                        <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name}</h1>
                    </div>
                </section>
                <section className="mb-16">
                    <div className="space-y-4">
                        {canAdd && <div className="flex w-full justify-end space-x-2">
                            <Link
                                href={`/${assessmentType.id}/assessments/add-collection`}
                                className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-3 text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
                            >
                                Add Assessment Collection
                            </Link>
                            <Link
                                href={`/${assessmentType.id}/assessments/add-assessment`}
                                className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-3 text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
                            >
                                Add Assessment
                            </Link>
                        </div>}
                        <Table className="cursor-pointer dark:bg-transparent">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assessments.map((assessment: Assessment, key: number) => (
                                <TableRow key={key} onClick={() =>
                                    router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
                                }>
                                    <TableCell>{assessment.projectId}</TableCell>
                                    <TableCell>{assessment.name}</TableCell>
                                    <TableCell>{assessment.status}</TableCell>
                                    <TableCell>{`${assessment.date.getMonth() + 1}/${assessment.date.getDate()}/${assessment.date.getFullYear()}`}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        )
    }
    return <NotFound pageType="type" />
}