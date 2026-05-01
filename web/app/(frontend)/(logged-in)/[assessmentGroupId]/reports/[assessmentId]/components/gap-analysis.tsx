"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  AssessmentPart,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Attribute,
  Level,
  Section,
  Part
} from "@/prisma/mssql/generated/client"

export default function GapAnalysis({
  assessmentId,
  assessmentPartName,
  groups,
  attributes,
  assessmentResponses,
  deltaGroupName
}: Readonly<{
  assessmentId: number
  assessmentPartName: string
  groups: AssessmentUserGroup[]
  attributes: (Attribute & {
    levels: Level[],
    section: Section & {
      part: Part & {
        assessmentPart: AssessmentPart[]
      }
    }
  })[]
  assessmentResponses: (AssessmentUserResponse & { level: Level })[]
  deltaGroupName: string
}>) {

  const [dataType, setDataType] = useState<"ratings" | "scores">("ratings")

  const deltaGroup = groups.find((g) => g.name === deltaGroupName)
  const nonDeltaGroups = groups.filter((g) => g.name !== deltaGroupName)

  return (
    <div className="w-full flex flex-col space-y-8">
      <div className="space-y-4">
        <div className="flex md:flex-row md:justify-between items-end max-md:space-y-4">
          <h2 className="text-2xl font-bold">{assessmentPartName} Gap Analysis</h2>
          <div>
            <Button
              className="rounded-r-none"
              onClick={() => setDataType("ratings")}
              disabled={dataType === "ratings"}
            >
              Ratings
            </Button>
            <Button
              className="rounded-l-none"
              onClick={() => setDataType("scores")}
              disabled={dataType === "scores"}
            >
              Scores
            </Button>
          </div>
        </div>
        <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
          <Table className="table-fixed text-xs dark:bg-transparent">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 w-32 bg-white dark:bg-[#171537]" />
                {attributes.map((attribute) => {
                  const attributeIdDisplay =
                    attribute.section.part.attributeType === "Factor" ? attribute.id : attribute.id.toUpperCase()
                  return (
                    <TableHead key={attribute.id} className="w-14 text-center">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            {attributeIdDisplay}
                          </TooltipTrigger>
                          <TooltipContent className="text-center">
                            {attributeIdDisplay}. {attribute.name}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonDeltaGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">
                    {dataType === "ratings" ? "Rating" : "Score"} Average: {group.name}
                  </TableHead>
                  {attributes.map((attribute) => {
                    const groupAttributeResponses = assessmentResponses.filter(
                      (assessmentUserResponse) =>
                        assessmentUserResponse.assessmentId === assessmentId &&
                        assessmentUserResponse.assessmentUserGroupId === group.id &&
                        assessmentUserResponse.attributeId === attribute.id
                    )

                    const groupAverage = (groupAttributeResponses.reduce(
                      (total, response) => total + response.level.level, 0
                    ) / groupAttributeResponses.length).toFixed(2)

                    const groupAverageScore = (groupAttributeResponses.reduce(
                      (total, response) => total + response.level.weight, 0
                    ) / groupAttributeResponses.length).toFixed(2)

                    const attributeResponses = assessmentResponses.filter((assessmentUserResponse) => {
                      if (deltaGroupName === "Average") {
                        return assessmentUserResponse.assessmentId === assessmentId &&
                          assessmentUserResponse.attributeId === attribute.id
                      }
                      return assessmentUserResponse.assessmentId === assessmentId &&
                        assessmentUserResponse.assessmentUserGroupId === deltaGroup?.id &&
                        assessmentUserResponse.attributeId === attribute.id
                    })

                    const average = (attributeResponses.reduce(
                      (total, response) => total + response.level.level, 0
                    ) / attributeResponses.length).toFixed(2)
                    const deltaGroupAverage = attributeResponses[0] ? attributeResponses[0].level.level : 0

                    let delta = parseFloat(groupAverage) - (deltaGroupName === "Average" ? parseFloat(average) : deltaGroupAverage)
                    if (deltaGroupName !== "Average") {
                      delta = delta / 10
                    }
                    var bgColor = delta >= 0 ? "bg-blue-400/40 dark:bg-blue-800/40" : "bg-orange-400/40 dark:bg-orange-800/40"
                    if (delta <= -0.4) {
                      bgColor = "bg-orange-800/80 dark:bg-orange-400/80"
                    } else if (delta > -0.4 && delta <= -0.3) {
                      bgColor = "bg-orange-700/70 dark:bg-orange-500/70"
                    } else if (delta > -0.3 && delta <= -0.2) {
                      bgColor = "bg-orange-600/60 dark:bg-orange-600/60"
                    } else if (delta > -0.2 && delta <= -0.1) {
                      bgColor = "bg-orange-500/50 dark:bg-orange-700/50"
                    } else if (delta > -0.1 && delta < 0) {
                      bgColor = "bg-orange-400/40 dark:bg-orange-800/40"
                    } else if (delta === 0) {
                      bgColor = "bg-transparent"
                    } else if (delta > 0 && delta <= 0.1) {
                      bgColor = "bg-blue-400/40 dark:bg-blue-800/40"
                    } else if (delta > 0.1 && delta <= 0.2) {
                      bgColor = "bg-blue-500/50 dark:bg-blue-700/50"
                    } else if (delta > 0.2 && delta <= 0.3) {
                      bgColor = "bg-blue-600/60 dark:bg-blue-600/60"
                    } else if (delta > 0.3 && delta <= 0.4) {
                      bgColor = "bg-blue-700/70 dark:bg-blue-500/70"
                    } else if (delta > 0.4) {
                      bgColor = "bg-blue-800/80 dark:bg-blue-400/80"
                    }

                    return (
                      <TableCell key={attribute.id} className={bgColor + " text-center"}>
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger>
                              {dataType === "ratings" ? groupAverage : groupAverageScore}
                            </TooltipTrigger>
                            <TooltipContent className="text-center">
                              Delta: {delta.toFixed(2)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableHead className="font-bold sticky left-0 bg-white dark:bg-[#171537]">
                  {dataType === "ratings" ? "Rating" : "Score"} Average: {deltaGroupName === "Average" ? "Overall Total" : deltaGroupName}
                </TableHead>
                {attributes.map((attribute) => {
                  const attributeResponses = assessmentResponses.filter((assessmentUserResponse) => {
                    if (deltaGroupName === "Average") {
                      return assessmentUserResponse.assessmentId === assessmentId &&
                        assessmentUserResponse.attributeId === attribute.id
                    }
                    return assessmentUserResponse.assessmentId === assessmentId &&
                      assessmentUserResponse.assessmentUserGroupId === deltaGroup?.id &&
                      assessmentUserResponse.attributeId === attribute.id
                  })

                  const average = (attributeResponses.reduce(
                    (total, response) => total + response.level.level, 0
                  ) / attributeResponses.length).toFixed(2)
                  const deltaGroupAverage = attributeResponses[0] ? attributeResponses[0].level.level : 0

                  const averageScore = (attributeResponses.reduce(
                    (total, response) => total + response.level.weight, 0
                  ) / attributeResponses.length).toFixed(2)
                  const deltaGroupAverageScore = attributeResponses[0] ? attributeResponses[0].level.weight : 0

                  return (
                    <TableCell key={attribute.id}>
                      {
                        dataType === "ratings" ?
                          (deltaGroupName === "Average" ? average : `${deltaGroupAverage}.00`) :
                          (deltaGroupName === "Average" ? averageScore : `${deltaGroupAverageScore}.00`)
                      }
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Legend</h3>
        <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
          <Table className="table-fixed text-xs dark:bg-transparent">
            <TableHeader>
              <TableRow>
                <TableHead colSpan={10} className="text-center">
                  Delta = (group average - {deltaGroupName === "Average" ? "total" : deltaGroupName} average){assessmentPartName === "Maturity" && " / 10"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="bg-orange-800/80 dark:bg-orange-400/80" />
                <TableCell className="bg-orange-700/70 dark:bg-orange-500/70" />
                <TableCell className="bg-orange-600/60 dark:bg-orange-600/60" />
                <TableCell className="bg-orange-500/50 dark:bg-orange-700/50" />
                <TableCell className="bg-orange-400/40 dark:bg-orange-800/40" />
                <TableCell className="bg-blue-400/40 dark:bg-blue-800/40" />
                <TableCell className="bg-blue-500/50 dark:bg-blue-700/50" />
                <TableCell className="bg-blue-600/60 dark:bg-blue-600/60" />
                <TableCell className="bg-blue-700/70 dark:bg-blue-500/70" />
                <TableCell className="bg-blue-800/80 dark:bg-blue-400/80" />
              </TableRow>
              <TableRow>
                <TableCell className="text-right pr-0">-0.4</TableCell>
                <TableCell className="text-right pr-0">-0.3</TableCell>
                <TableCell className="text-right pr-0">-0.2</TableCell>
                <TableCell className="text-right pr-0">-0.1</TableCell>
                <TableCell colSpan={2} className="text-center">0</TableCell>
                <TableCell className="pl-0">0.1</TableCell>
                <TableCell className="pl-0">0.2</TableCell>
                <TableCell className="pl-0">0.3</TableCell>
                <TableCell className="pl-0">0.4</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
