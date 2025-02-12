"use client"
import { Session } from "@/auth"
import { 
    AssessmentType, 
    Assessment,
    Permission
} from "@/prisma/mssql/generated/client"
import { 
  isAdmin, 
  isCollectionManager, 
  isManagerForCollection,
  isLeadForAssessment,
  canViewUsers
} from "../../utils/permissions"

import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { 
    SquarePen,
    FileChartColumn,
    Users,
    Trash2
  } from "lucide-react"
import NotFound from "@/app/(frontend)/components/notFound"

import { useRouter } from "next/navigation"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
    assessments, 
    assessmentType,
    session
}: {
    readonly assessments: Assessment[], 
    readonly assessmentType: AssessmentType | null,
    readonly session: Session | null
}) {
    const router = useRouter()
    const canAdd = isAdmin(session) || isCollectionManager(session)
    if(assessmentType) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4 max-lg:ml-2">
                        <div className="flex flex-col max-sm:space-y-2 sm:flex-row justify-between">
                            <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name}</h1>
                            {canAdd && <div className="flex flex-col max-sm:space-y-2 sm:flex-row sm:space-x-2 justify-end">
                                <Link
                                    href={`/${assessmentType.id}/assessments/manage-collections`}
                                    className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-4 text-sm text-center font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    prefetch={false}
                                >
                                    Manage Assessment Collections
                                </Link>
                                <Link
                                    href={`/${assessmentType.id}/assessments/add-assessment`}
                                    className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-4 text-sm text-center font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    prefetch={false}
                                >
                                    Add Assessment
                                </Link>
                            </div>}
                        </div>
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
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assessments.map((assessment: Assessment, key: number) => {
                                const permissions = session?.user?.assessmentUser.find(assessmentUser => 
                                    assessmentUser.assessmentId === assessment.id
                                )?.permissions
                                return(
                                    <TableRow key={key} onClick={() =>
                                        router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
                                    }>
                                        <TableCell>{assessment.projectId}</TableCell>
                                        <TableCell>{assessment.name}</TableCell>
                                        <TableCell>{assessment.status}</TableCell>
                                        <TableCell>{`${assessment.date.getMonth() + 1}/${assessment.date.getDate()}/${assessment.date.getFullYear()}`}</TableCell>
                                        <TableCell>
                                            <AssessmentActions 
                                                assessmentTypeId={assessmentType.id} 
                                                assessment={assessment} 
                                                session={session}
                                                permissions={permissions}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        )
    }
    return <NotFound pageType="type" />
}

function AssessmentActions({ 
    assessmentTypeId, 
    assessment,
    session,
    permissions
}: { 
    assessmentTypeId: number, 
    assessment: Assessment,
    session: Session | null,
    permissions: Permission[] | undefined
}) {
    const canEdit = 
        isAdmin(session) || 
        isManagerForCollection(session, assessment.assessmentCollectionId) || 
        isLeadForAssessment(session, assessment.id.toString()) || 
        permissions?.find(permission => permission.name === "Edit assessments") !== undefined
    const canView = canViewUsers(session)
    const canDelete = 
        isAdmin(session) || 
        isManagerForCollection(session, assessment.assessmentCollectionId) || 
        permissions?.find(permission => permission.name === "Delete assessments") !== undefined
    return (
        <div className="grid grid-cols-2 gap-2 w-20">
            {canEdit && <Link 
                href={`/${assessmentTypeId}/assessments/${assessment.id}/edit-assessment`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <SquarePen className="w-5 h-5 text-white" />
            </Link>}
            <Link 
                href={`/${assessmentTypeId}/reports/${assessment.id}`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <FileChartColumn className="w-5 h-5 text-white" />
            </Link>
            {canView && <Link 
                href={`/${assessmentTypeId}/users/${assessment.id}`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <Users className="w-5 h-5 text-white" />
            </Link>}
            {canDelete && <Link 
                href={`/${assessmentTypeId}/assessments/${assessment.id}/edit-assessment`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <Trash2 className="w-5 h-5 text-white" />
            </Link>}
        </div>
    )
}