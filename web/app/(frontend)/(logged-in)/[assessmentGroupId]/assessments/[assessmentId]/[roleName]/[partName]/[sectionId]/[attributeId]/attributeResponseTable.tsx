"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AssessmentUserResponse,
  Level,
  User,
} from "@/prisma/mssql/generated/client"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function AttributeResponseTable({
  userResponses,
  levels,
}: {
  readonly userResponses: (AssessmentUserResponse & { user?: User })[]
  readonly levels: Level[]
}) {
  return (
    <section className="mb-16 flex flex-col space-y-4">
      <h2 className="text-2xl font-bold max-lg:ml-2">Participant Responses</h2>
      <Table className="dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userResponses.length > 0 ? (
            userResponses.map(
              (userResponse: AssessmentUserResponse & { user?: User }) => {
                const userResponseLevel = levels.find(
                  (level: Level) => level.id === userResponse?.levelId
                )
                return (
                  <TableRow key={userResponse.id}>
                    <TableCell>{userResponse.userId}</TableCell>
                    <TableCell>
                      {userResponse.user?.lastName},{" "}
                      {userResponse.user?.firstName}
                    </TableCell>
                    <TableCell>{userResponseLevel?.level}</TableCell>
                    <TableCell>{userResponse.notes}</TableCell>
                  </TableRow>
                )
              }
            )
          ) : (
            <TableRow className="text-muted-foreground dark:text-indigo-300/80">
              <TableCell colSpan={4}>No responses found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
