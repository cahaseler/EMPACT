"use client"

import { useState } from "react"

import { ColumnDef } from "@tanstack/react-table"
import { SquarePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { SystemRole, User } from "@/prisma/mssql/generated/client"
import { updateUser } from "./actions"

// The type for our user data that includes roles
export type UserWithRoles = User & { systemRoles: SystemRole[] }

// User action component for editing user details
export function UserActions({ user }: { readonly user: UserWithRoles }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    systemRoleIds: user.systemRoles.map((role: SystemRole) => role.id),
  })

  // Handle update user
  const handleUpdateUser = async () => {
    try {
      setIsUpdating(true)
      const result = await updateUser(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsEditDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <div className="flex justify-start">
        <Button size="icon" onClick={() => setIsEditDialogOpen(true)}>
          <SquarePen className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            {/* System Roles section - if we have available roles */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Roles</Label>
              <div className="col-span-3 space-y-2">
                {/* For simplicity, just showing Admin role. In a real implementation,
                    you would map over all available roles from your system */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin-role"
                    checked={formData.systemRoleIds.includes(1)} // Assuming Admin role has ID 1
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          systemRoleIds: [...formData.systemRoleIds, 1],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          systemRoleIds: formData.systemRoleIds.filter(
                            (id: number) => id !== 1
                          ),
                        })
                      }
                    }}
                  />
                  <Label htmlFor="admin-role">Admin</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpdateUser}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Column definitions
export const columns: ColumnDef<UserWithRoles>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableHiding: false,
  },
  {
    accessorFn: (row) => `${row.lastName}, ${row.firstName}`,
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    id: "isAdmin",
    accessorFn: (row) => row.systemRoles.some((role) => role.name === "Admin"),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Admin?" />
    ),
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin")
      return <div>{isAdmin ? "Yes" : "No"}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) ? "true" : "false")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
]
