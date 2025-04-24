"use client"

import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import {
  AssessmentUserResponse,
  Attribute,
  Level,
  Part
} from "@/prisma/mssql/generated/client"

export default function DataTable({
  part,
  urlHead,
  attributes,
  userResponses,
}: Readonly<{
  part: Part,
  urlHead: string,
  attributes: (Attribute & { levels: Level[] })[],
  userResponses: AssessmentUserResponse[],
}>) {
  const router = useRouter()
  return (
    <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
      <Table className="dark:bg-transparent">
        <TableHeader>
          <TableRow>
            <TableHead>{part.attributeType}</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="cursor-pointer">
          {attributes.map(
            (attribute: Attribute & { levels: Level[] }, key: number) => {
              const attributeResponses = userResponses.filter(
                (userResponse: AssessmentUserResponse) => userResponse.attributeId === attribute.id
              )
              const attributeResponseLevels = attributeResponses.map(
                (attributeResponse: AssessmentUserResponse) => attributeResponse.levelId
              )
              const attributeIdDisplay =
                part.attributeType === "Attribute" ?
                  attribute.id.toUpperCase() :
                  attribute.id
              const levels = attribute.levels.filter(
                (level: Level) => attributeResponseLevels.includes(level.id)
              ).map(
                (level: Level) => level.level
              )
              return (
                <TableRow
                  key={key}
                  onClick={() =>
                    router.push(
                      `/${urlHead}/${attribute.id}`
                    )
                  }
                >
                  <TableCell className="w-1/2">
                    {attributeIdDisplay}. {attribute.name}
                  </TableCell>
                  <TableCell className="w-20">
                    {levels.length > 0 ? levels[0] : "---"}
                  </TableCell>
                  <TableCell>
                    {attributeResponses.length > 0
                      ? attributeResponses[0]?.notes
                      : "---"}
                  </TableCell>
                </TableRow>
              )
            }
          )}
        </TableBody>
      </Table>
    </div>
  )
}
