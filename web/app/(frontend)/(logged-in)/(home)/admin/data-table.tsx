"use client"

import { DataTable } from "@/components/ui/data-table/data-table"
import { SystemRole, User } from "@/prisma/mssql/generated/client"
import { columns } from "./columns"

export default function UsersDataTable({
  users,
}: Readonly<{
  users: (User & { systemRoles: SystemRole[] })[]
}>) {
  // Define searchable and filterable columns
  const searchableColumns = [
    {
      id: "email",
      title: "Email",
    },
  ]

  const filterableColumns = [
    {
      id: "isAdmin",
      title: "Admin Status",
      options: [
        {
          label: "Admin",
          value: "true",
        },
        {
          label: "Regular User",
          value: "false",
        },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={users}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
      />
    </div>
  )
}
