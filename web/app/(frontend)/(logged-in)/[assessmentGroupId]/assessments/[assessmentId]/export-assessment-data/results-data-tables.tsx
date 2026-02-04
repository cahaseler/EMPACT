"use client"

import React from "react"

import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Assessment,
  AssessmentAttribute,
  AssessmentPart,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Attribute,
  Level,
  Part,
  ScoreSummary,
  Section,
  User
} from "@/prisma/mssql/generated/client"
import { sortAttributes } from "../../../../utils/dataCalculations"
import { exportResults } from "./export"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import { toast } from "@/components/ui/use-toast"

import GroupResultsDataTable from "./components/group-results-data-table"
import AllGroupsResultsDataTable from "./components/all-groups-results-data-table"

export default function ResultsDataTables({
  assessment,
  assessmentPart,
  groups,
  assessmentUsers,
  scores
}: {
  readonly assessment: Assessment & {
    assessmentParts: (AssessmentPart & { part: Part })[],
    assessmentAttributes: (AssessmentAttribute & { attribute: Attribute & { levels: Level[], section: Section & { part: Part & { assessmentPart: AssessmentPart[] } } } })[]
  }
  readonly assessmentPart: AssessmentPart & { part: Part }
  readonly groups: AssessmentUserGroup[]
  readonly assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & { level: Level })[]
    },
    participantParts: AssessmentPart[]
  })[],
  readonly scores: ScoreSummary[]
}) {

  const router = useRouter()

  const attributesInPart = sortAttributes(assessment.assessmentAttributes.filter((attribute) => {
    return attribute.attribute.section.partId === assessmentPart.part.id
  }).map((attribute) => attribute.attribute))
  const attributeIds = attributesInPart.map(attribute => attribute.id)

  const scoresInPart = scores?.filter((score) => {
    return score.assessmentPartId === assessmentPart.id
  })

  const averageTotalScore = Math.round(scoresInPart?.reduce(
    (total, groupTotalScore) => total + groupTotalScore.score, 0
  ) / scoresInPart?.length)

  const assessmentUsersInPart = assessmentUsers.filter((assessmentUser) => {
    return assessmentUser.assessmentUserGroupId !== null ||
      assessmentUser.participantParts.some(
        (participantPart) => participantPart.id === assessmentPart.id
      )
  })

  const [exporting, setExporting] = React.useState<boolean>(false)
  const handleExport = () => {
    setExporting(true)
    exportResults({
      assessmentName: assessment.name,
      assessmentPartName: assessmentPart.part.name,
      groups,
      attributeType: assessmentPart.part.attributeType,
      attributeIds,
      assessmentUsers: assessmentUsersInPart,
      totalScores: scoresInPart
    }).then(() => {
      router.refresh()
      toast({
        title: `${assessmentPart.part.name} results exported successfully.`
      })
      setExporting(false)
    }).catch(error => {
      router.refresh()
      toast({
        title: `Error exporting ${assessmentPart.part.name} results: ${error}`
      })
      setExporting(false)
    })
  }

  return (
    <div key={assessmentPart.id} className="mb-4">
      <div className="mb-2">
        <h2 className="text-2xl font-bold tracking-tighter">
          {assessmentPart.part.name} Results
        </h2>
      </div>
      <Accordion
        type="single"
        collapsible={true}
        className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
      >
        {groups.map(group => {
          const groupTotalScore = scoresInPart?.find(
            groupTotalScore => groupTotalScore.assessmentUserGroupId === group.id
          )?.score
          const groupAssessmentUsers = assessmentUsers.filter((assessmentUser) => {
            return assessmentUser.assessmentUserGroupId === group.id ||
              assessmentUser.participantParts.some(
                (participantPart) => participantPart.id === assessmentPart.id
              )
          })
          return (
            <AccordionItem key={group.id} value={group.name} className="last:border-b-0 group">
              <AccordionTrigger className="mx-4 hover:no-underline">
                <div className="flex flex-col space-y-4">
                  <span className="text-indigo-950 dark:text-indigo-200 text-left text-2xl font-bold">
                    {group.name}
                  </span>
                  <span
                    className="group-data-[state=closed]:block group-data-[state=open]:hidden text-lg text-left font-bold text-indigo-800 dark:text-indigo-300"
                  >
                    Total Score: {(groupTotalScore && !isNaN(groupTotalScore)) ? groupTotalScore : "N/A"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent
                className="flex flex-col space-y-4 px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg [&_div:last-child]:border-0 [&_div:last-child]:pb-0"
              >
                <GroupResultsDataTable
                  groupId={group.id}
                  attributeType={assessmentPart.part.attributeType}
                  attributeIds={attributeIds}
                  assessmentUsers={groupAssessmentUsers}
                  totalScore={groupTotalScore}
                />
              </AccordionContent>
            </AccordionItem>
          )
        })}
        <AccordionItem value="All Groups" className="last:border-b-0 group">
          <AccordionTrigger className="mx-4 hover:no-underline">
            <div className="flex flex-col space-y-4">
              <span className="text-indigo-950 dark:text-indigo-200 text-left text-2xl font-bold">
                All Groups
              </span>
              <span
                className="group-data-[state=closed]:block group-data-[state=open]:hidden text-lg text-left font-bold text-indigo-800 dark:text-indigo-300"
              >
                Total Score: {(averageTotalScore && !isNaN(averageTotalScore)) ? averageTotalScore : "N/A"}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent
            className="flex flex-col space-y-4 px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg [&_div:last-child]:border-0 [&_div:last-child]:pb-0"
          >
            <AllGroupsResultsDataTable
              groups={groups}
              attributeType={assessmentPart.part.attributeType}
              attributeIds={attributeIds}
              assessmentUsers={assessmentUsersInPart}
              totalScore={averageTotalScore}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-4 flex flex-col items-center space-y-8">
        <Button onClick={handleExport} disabled={exporting}>
          {exporting && <Loader className="mr-2 h-4 w-4 animate-spin" />} Export {assessmentPart.part.name} Results
        </Button>
      </div>
    </div>
  )
};