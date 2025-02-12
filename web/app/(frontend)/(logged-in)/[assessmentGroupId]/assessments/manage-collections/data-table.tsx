"use client"
import { Session } from "@/auth"
import { 
    AssessmentType, 
    AssessmentCollection,
    Assessment
} from "@/prisma/mssql/generated/client"
import { isAdmin } from "../../../utils/permissions"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"

import AddCollection from "./add-collection"
import DataRow from "./data-row"

import { useState } from "react"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
    collections, 
    assessmentType,
    session
}: {
    readonly collections: (AssessmentCollection & { assessments: Assessment[] } )[], 
    readonly assessmentType: AssessmentType | null,
    readonly session: Session | null
}) {
    const [isAdding, setIsAdding] = useState<boolean>(false)
    if(assessmentType) {
        const links = [
            {
                url: `/${assessmentType.id}/assessments`, 
                name: assessmentType.name
            },
        ]
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4 max-lg:ml-2">
                        <Breadcrumbs links={links} currentPage="Manage Assessment Collections" />
                        <div className="flex flex-col max-sm:space-y-2 sm:flex-row sm:space-x-2 justify-between">
                            <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name} Collections</h1>
                            {!isAdding ? <Button 
                                onClick={() => setIsAdding(true)} 
                                className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-6 text-wrap text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                Add Assessment Collection
                            </Button>
                            : <Button 
                                onClick={() => setIsAdding(false)} 
                                className="inline-flex items-center justify-center rounded-md border-indigo-700/90 bg-transparent hover:bg-transparent border-2 hover:border-indigo-700/70 text-indigo-700/90 hover:text-indigo-700/70 px-8 py-6 text-wrap text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                Cancel
                            </Button>}
                        </div>
                    </div>
                </section>
                {isAdding && <AddCollection assessmentTypeId={assessmentType.id} session={session}/>}
                <section className="mb-16">
                    <div className="space-y-4">
                        <Table className="table-fixed dark:bg-transparent">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-32">Collection ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Assessments</TableHead>
                                    <TableHead className="w-32">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {collections.map((collection: AssessmentCollection & { assessments: Assessment[] }) => 
                                    <DataRow collection={collection} assessmentType={assessmentType} isAdmin={isAdmin(session)} />
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        )
    }
    return <NotFound pageType="type" />
}