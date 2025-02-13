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
import { Button } from "@/components/ui/button"
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
                                    prefetch={false}
                                >
                                    <Button>Manage Assessment Collections</Button>
                                </Link>
                                <Link
                                    href={`/${assessmentType.id}/assessments/add-assessment`}
                                    prefetch={false}
                                >
                                    <Button>Add Assessment</Button>
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
                                    <TableRow key={key}>
                                        <TableCell onClick={() =>
                                            router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
                                        }>
                                            {assessment.projectId}
                                        </TableCell>
                                        <TableCell onClick={() =>
                                            router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
                                        }>
                                            {assessment.name}
                                        </TableCell>
                                        <TableCell onClick={() =>
                                            router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
                                        }>
                                            {assessment.status}
                                        </TableCell>
                                        <TableCell onClick={() =>
                                            router.push(`/${assessmentType.id}/assessments/${assessment.id}`)
                                        }>
                                            {`${assessment.date.getMonth() + 1}/${assessment.date.getDate()}/${assessment.date.getFullYear()}`}
                                        </TableCell>
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
            {canEdit && 
                <Link href={`/${assessmentTypeId}/assessments/${assessment.id}/edit-assessment`}>
                    <Button size="icon">
                        <SquarePen className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            }
            <Link href={`/${assessmentTypeId}/reports/${assessment.id}`}>
                <Button size="icon">
                    <FileChartColumn className="w-5 h-5 text-white" />
                </Button>
            </Link>
            {canView && 
                <Link href={`/${assessmentTypeId}/users/${assessment.id}`}>
                    <Button size="icon">
                        <Users className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            }
            {canDelete && 
                <Button size="icon">
                    <Trash2 className="w-5 h-5 text-white" />
                </Button>
            }
        </div>
    )
}