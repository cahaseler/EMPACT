"use client"
import { Session } from "@/auth"
import { 
  AssessmentType, 
  Assessment, 
  User, 
  AssessmentUser,
  Permission 
} from "@/prisma/mssql/generated/client"
import { 
  isAdmin,
  isManagerForCollection,
  isLeadForAssessment,
  isFacForAssessment
} from "../../../utils/permissions"

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
import { SquarePen, Trash2 } from "lucide-react"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"

import { useRouter } from "next/navigation"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  users,
  assessment, 
  assessmentType,
  session,
  permissions
}: Readonly<{
  readonly users: (AssessmentUser & { user: User })[],
  assessment: Assessment | null, 
  assessmentType: AssessmentType | null,
  readonly session: Session | null,
  readonly permissions: Permission[] | undefined
}>) {   
  const router = useRouter()

  if(assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/users`, 
        name: `${assessmentType.name} Users`
      },
    ]
    if(assessment) {
      const canAddEdit = 
        isAdmin(session) || 
        isManagerForCollection(session, assessment.assessmentCollectionId) || 
        isLeadForAssessment(session, assessment.id.toString()) || 
        isFacForAssessment(session, assessment.id.toString())
      const canRegroup = 
        isAdmin(session) || 
        isManagerForCollection(session, assessment?.assessmentCollectionId) || 
        isLeadForAssessment(session, assessment.id.toString()) || 
        permissions?.find(permission => permission.name === "Regroup users") !== undefined
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={`${assessment.name} Users`} />
              <div className="flex flex-col max-md:space-y-2 md:flex-row justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter">{assessment.name} Users</h1>
                  <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                    {assessment.description}
                  </p>
                </div>
                <div className="flex flex-row space-x-2 justify-end">
                  {canRegroup && 
                    <Link
                      href={`/${assessmentType.id}/users/${assessment.id}/regroup-assessment-users`}
                      prefetch={false}
                    >
                      <Button>
                        Manage User Groups
                      </Button>
                    </Link>
                  }
                  {canAddEdit && 
                    <Link
                      href={`/${assessmentType.id}/users/${assessment.id}/add-assessment-users`}
                      prefetch={false}
                    >
                      <Button>
                        Add Users to Assessment
                      </Button>
                    </Link>
                  }
                </div>
              </div>
            </div>
          </section>
          <section className="mb-16">
            <div className="space-y-4">
                <Table className="dark:bg-transparent">
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: AssessmentUser & { user: User }, key: number) => (
                        <TableRow key={key}>
                            <TableCell>{user.user.id}</TableCell>
                            <TableCell>{user.user.lastName}, {user.user.firstName}</TableCell>
                            <TableCell>{user.user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              {canAddEdit && <UserActions 
                                assessmentTypeId={assessmentType.id} 
                                assessmentId={assessment.id} 
                                assessmentUserId={user.id}
                              />}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </section>
        </div>
      )
    }
    return <NotFound links={links} pageType="assessment" />
  }
  return <NotFound pageType="type" />
}

function UserActions({ 
  assessmentTypeId, 
  assessmentId,
  assessmentUserId,
}: { 
  assessmentTypeId: number, 
  assessmentId: number,
  assessmentUserId: number,
}) {
  return (
      <div className="grid grid-cols-2 gap-2 w-20">
        <Link href={`/${assessmentTypeId}/users/${assessmentId}/edit-user/${assessmentUserId}`} >
          <Button size="icon">
            <SquarePen className="w-5 h-5 text-white" />
          </Button>
        </Link>
        <Button size="icon">
          <Trash2 className="w-5 h-5 text-white" />
        </Button>
      </div>
  )
}