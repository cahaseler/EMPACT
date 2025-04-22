"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { DataTable } from "@/components/ui/data-table/data-table"

import {
  AssessmentUserResponse,
  Level,
  User,
} from "@/prisma/mssql/generated/client"

import { columns } from "./columns"

export default function AttributeResponseTable({
  assessmentStatus,
  userResponses,
  levels,
  numParticipants
}: {
  readonly assessmentStatus: string
  readonly userResponses: (AssessmentUserResponse & { user?: User, level?: Level })[]
  readonly levels: Level[]
  readonly numParticipants: number
}) {

  const router = useRouter()

  // While the assessment is active and not all responses for the attribute have been submitted, 
  // refresh the page every 10 seconds to get updated response data
  useEffect(() => {
    if (assessmentStatus === "Active" && userResponses.length < numParticipants) {
      setTimeout(() => {
        router.refresh()
      }, 10000)
    }
  }, [userResponses])

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
      <div className="flex flex-col max-md:space-y-2 md:flex-row md:justify-between md:items-end">
        <h2 className="text-2xl font-bold">Participant Responses</h2>
        <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
          Number of submitted responses: {userResponses.length} of {numParticipants}
        </p>
      </div>
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
