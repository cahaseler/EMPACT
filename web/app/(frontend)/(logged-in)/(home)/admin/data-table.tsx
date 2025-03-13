"use client"
import { 
  User, 
  SystemRole
} from "@/prisma/mssql/generated/client"

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
  users
}: Readonly<{
  users: (User & { systemRoles: SystemRole[] })[]
}>) {   
  return(
    <Table className="dark:bg-transparent">
      <TableHeader>
          <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Is Admin?</TableHead>
              <TableHead>Actions</TableHead>
          </TableRow>
      </TableHeader>
      <TableBody>
          {users.map((user: User & { systemRoles: SystemRole[] }, key: number) => (
            <TableRow key={key}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.lastName}, {user.firstName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.systemRoles.find(role => role.name === "Admin") ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <UserActions userId={user.id} />
                </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

function UserActions({ userId }: { userId: number }) {
  {/* TODO: Edit and delete functionality */}
  return (
      <div className="grid grid-cols-2 gap-2 w-20">
        <Button size="icon">
          <SquarePen className="w-5 h-5 text-white" />
        </Button>
        <Button size="icon">
          <Trash2 className="w-5 h-5 text-white" />
        </Button>
      </div>
  )
}