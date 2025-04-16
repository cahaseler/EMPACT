"use client"

import { DataTable } from "@/components/ui/data-table/data-table"

import {
  AssessmentUserResponse,
  Level,
  User,
} from "@/prisma/mssql/generated/client"

import { columns } from "./columns"

export default function AttributeResponseTable({
  userResponses,
  levels,
}: {
  readonly userResponses: (AssessmentUserResponse & { user?: User, level?: Level })[]
  readonly levels: Level[]
}) {
  // Define searchable and filterable columns
  const searchableColumns = [
    {
      id: "name",
      title: "Name",
    },
  ]

  const filterableColumns = [
    {
      id: "level",
      title: "Rating",
      options: levels.map(
        level => ({
          label: level.level.toString(),
          value: level.level.toString()
        })
      ),
    },
  ]

  return (
    <section className="mb-16 flex flex-col space-y-4">
      <h2 className="text-2xl font-bold max-lg:ml-2">Participant Responses</h2>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={userResponses}
          selectable={false}
          searchableColumns={searchableColumns}
          filterableColumns={filterableColumns}
        />
      </div>
    </section>
  )
}
