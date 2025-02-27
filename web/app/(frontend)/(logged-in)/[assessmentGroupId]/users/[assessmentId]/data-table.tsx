"use client"
import { 
  AssessmentType, 
  Assessment, 
  User, 
  AssessmentUser,
  AssessmentUserGroup
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
import { SquarePen } from "lucide-react"

import DeleteModule from "./delete-module"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
  users,
  assessment, 
  assessmentType,
  groups,
  canEdit
}: Readonly<{
  users: (AssessmentUser & { user: User })[],
  assessment: Assessment, 
  assessmentType: AssessmentType,
  groups: AssessmentUserGroup[],
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
                <TableHead>Group</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map((user: AssessmentUser & { user: User }, key: number) => { 
              const group = groups.find((group: AssessmentUserGroup) => group.id === user.assessmentUserGroupId)
              return (
                <TableRow key={key}>
                    <TableCell>{user.user.id}</TableCell>
                    <TableCell>{user.user.lastName}, {user.user.firstName}</TableCell>
                    <TableCell>{user.user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{group ? group.name: "N/A"}</TableCell>
                    <TableCell>
                      {canEdit && <UserActions 
                        assessmentTypeId={assessmentType.id} 
                        assessmentId={assessment.id} 
                        assessmentUser={user}
                      />}
                    </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
    </Table>
  )
}

function UserActions({ 
  assessmentTypeId, 
  assessmentId,
  assessmentUser,
}: { 
  assessmentTypeId: number, 
  assessmentId: number,
  assessmentUser: AssessmentUser,
}) {
  return (
      <div className="grid grid-cols-2 gap-2 w-20">
        <Link href={`/${assessmentTypeId}/users/${assessmentId}/${assessmentUser.id}`} >
          <Button size="icon">
            <SquarePen className="w-5 h-5 text-white" />
          </Button>
        </Link>
        <DeleteModule 
            assessmentUser={assessmentUser} 
            assessmentTypeId={assessmentTypeId} 
            assessmentId={assessmentId} 
            buttonType="icon" 
        />
      </div>
  )
}