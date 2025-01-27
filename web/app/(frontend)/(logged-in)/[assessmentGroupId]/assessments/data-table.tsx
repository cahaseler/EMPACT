"use client"
import { Session } from "@/auth"
import { 
    AssessmentType, 
    Assessment,
    AssessmentUser,
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

export function DataTable({
    assessments, 
    assessmentType,
    session,
    assessmentUsersWithPermissions
}: {
    readonly assessments: Assessment[], 
    readonly assessmentType: AssessmentType | null,
    readonly session: Session | null,
    readonly assessmentUsersWithPermissions: (AssessmentUser & { permissions: Permission[] })[]
}) {
    const router = useRouter()
    const canAdd = isAdmin(session) || isCollectionManager(session)
    if(assessmentType) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4 max-lg:ml-2">
                        <div className="flex flex-row justify-between">
                            <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name}</h1>
                            {canAdd && <div className="flex justify-end space-x-2">
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
                                const permissions = assessmentUsersWithPermissions.filter(assessmentUser => assessmentUser.assessmentId === assessment.id)[0]?.permissions
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
                                                assessmentId={assessment.id} 
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
    assessmentId,
    session,
    permissions
}: { 
    assessmentTypeId: number, 
    assessmentId: number,
    session: Session | null,
    permissions: Permission[]
}) {
    const canEdit = 
        isAdmin(session) || 
        isManagerForCollection(session, null) || 
        isLeadForAssessment(session, assessmentId.toString()) || 
        permissions.find(permission => permission.name === "Edit assessments") !== undefined
    const canView = canViewUsers(session)
    const canDelete = 
        isAdmin(session) || 
        isManagerForCollection(session, null) || 
        permissions.find(permission => permission.name === "Delete assessments") !== undefined
    return (
        <div className="grid grid-cols-2 gap-2 w-20">
            {canEdit && <Link 
                href={`/${assessmentTypeId}/assessments/${assessmentId}/edit-assessment`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <SquarePen className="w-5 h-5 text-white" />
            </Link>}
            <Link 
                href={`/${assessmentTypeId}/reports/${assessmentId}`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <FileChartColumn className="w-5 h-5 text-white" />
            </Link>
            {canView && <Link 
                href={`/${assessmentTypeId}/users/${assessmentId}`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <Users className="w-5 h-5 text-white" />
            </Link>}
            {canDelete && <Link 
                href={`/${assessmentTypeId}/assessments/${assessmentId}/edit-assessment`} 
                className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-700/90 hover:bg-indigo-700/70"
            >
                <Trash2 className="w-5 h-5 text-white" />
            </Link>}
        </div>
    )
}