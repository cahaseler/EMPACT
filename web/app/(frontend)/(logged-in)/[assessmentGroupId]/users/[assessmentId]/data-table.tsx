"use client"
import { 
  AssessmentType, 
  Assessment, 
  User, 
  AssessmentUser
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

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  users,
  assessment, 
  assessmentType,
  canEdit
}: Readonly<{
  readonly users: (AssessmentUser & { user: User })[],
  assessment: Assessment, 
  assessmentType: AssessmentType,
  canEdit: boolean
}>) {   
  return (
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
                  {canEdit && <UserActions 
                    assessmentTypeId={assessmentType.id} 
                    assessmentId={assessment.id} 
                    assessmentUserId={user.id}
                  />}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
    </Table>
  )
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