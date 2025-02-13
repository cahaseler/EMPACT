"use client"
import { 
  User, 
  SystemRole,
  Assessment,
  AssessmentUser,
  AssessmentCollectionUser
} from "@/prisma/mssql/generated/client"

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

import { useRouter } from "next/navigation"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  isAdmin,
  users,
  assessments
}: Readonly<{
  readonly isAdmin: boolean,
  readonly users: (User & { 
    systemRoles: SystemRole[],
    assessmentUser: AssessmentUser[],
    assessmentCollectionUser: AssessmentCollectionUser[]
  })[],
  readonly assessments: Assessment[]
}>) {   
  const router = useRouter()
  
  if(isAdmin) {
    return (
      <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <div className="flex flex-row justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter">Admin Settings</h1>
                </div>
                <div className="flex flex-row space-x-2">
                  <Button>
                    <Link href={`/admin/add-users`} prefetch={false}>
                      Add Users
                    </Link>
                  </Button>
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
                            <TableHead>System Role(s)</TableHead>
                            <TableHead>Assigned Assessment(s)</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: User & { 
                            systemRoles: SystemRole[],
                            assessmentUser: AssessmentUser[],
                            assessmentCollectionUser: AssessmentCollectionUser[]
                        }, key: number) => (
                        <TableRow key={key}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.lastName}, {user.firstName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.systemRoles.length > 0 ? user.systemRoles.map((role) => role.name).join(", ") : "Participant"}</TableCell>
                            <TableCell>
                              <UserAssessments user={user} assessments={assessments} />
                            </TableCell>
                            <TableCell>
                              <UserActions userId={user.id} />
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
  return (
    <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
            <div className="space-y-8 max-lg:ml-2">
                <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                    You are not authorized to view this page.
                </p>
            </div>
        </section>
    </div>
  )
}

function UserAssessments ({ 
  user,
  assessments
}: Readonly<{ 
  user: User & { 
    systemRoles: SystemRole[],
    assessmentUser: AssessmentUser[],
    assessmentCollectionUser: AssessmentCollectionUser[]
  }, 
  assessments: Assessment[]
}>) {
  if (user.systemRoles.find(role => role.name === "Admin")) {
    return "N/A"
  }
  if (user.systemRoles.find(role => role.name === "Collection Manager")) {
    return (
      user.assessmentCollectionUser.map((user) => {
        const assessment = assessments.find(assessment => assessment.assessmentCollectionId === user.assessmentCollectionId)
        return assessment?.name
      }).join(", ")
    )
  }
  return (
    user.assessmentUser.map((user) => {
      const assessment = assessments.find(assessment => assessment.id === user.assessmentId)
      return assessment?.name
    }).join(", ")
  )
}

function UserActions({ userId }: { userId: number }) {
  return (
      <div className="grid grid-cols-2 gap-2 w-20">
        <Button size="icon">
          <Link href={`/admin/edit-user/${userId}`} >
            <SquarePen className="w-5 h-5 text-white" />
          </Link>
        </Button>
        <Button size="icon">
          <Trash2 className="w-5 h-5 text-white" />
        </Button>
      </div>
  )
}