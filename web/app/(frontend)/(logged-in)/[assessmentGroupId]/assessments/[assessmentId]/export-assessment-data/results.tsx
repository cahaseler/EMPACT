"use client"

import { useState } from "react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { toast } from "@/components/ui/use-toast"

import GroupResultsDataTable from "./components/group-results-data-table"
import AllGroupsResultsDataTable from "./components/all-groups-results-data-table"

function ResultsAccordionItem({
  assessmentPart,
  group,
  groups,
  attributeIds,
  assessmentUsers,
  totalScore
}: {
  readonly assessmentPart: AssessmentPart & { part: Part }
  readonly group?: AssessmentUserGroup
  readonly groups?: AssessmentUserGroup[]
  readonly attributeIds: string[]
  readonly assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & { level: Level })[]
    },
    participantParts: AssessmentPart[]
  })[],
  readonly totalScore?: number
}) {

  const [ratingsOrScores, setRatingsOrScores] = useState<"Ratings" | "Scores">("Ratings")

  return (
    <AccordionItem
      key={group ? group.id : "all-groups"}
      value={group ? group.name : "all-groups"}
      className="last:border-b-0 group"
    >
      <AccordionTrigger className="mx-4 hover:no-underline">
        <div className="flex flex-col space-y-4">
          <span className="text-indigo-950 dark:text-indigo-200 text-left text-2xl font-bold">
            {group ? group.name : "All Groups"}
          </span>
          <span
            className="group-data-[state=closed]:block group-data-[state=open]:hidden text-lg text-left font-bold text-indigo-800 dark:text-indigo-300"
          >
            Total Score: {(totalScore && !isNaN(totalScore)) ? totalScore : "N/A"}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent
        className="flex flex-col space-y-4 px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg [&_div:last-child]:border-0 [&_div:last-child]:pb-0"
      >
        <div className="flex flex-col space-y-4">
          <div className="w-full flex flex-row justify-end">
            <Button
              className="rounded-r-none"
              onClick={() => setRatingsOrScores("Ratings")}
              disabled={ratingsOrScores === "Ratings"}
            >
              Ratings
            </Button>
            <Button
              className="rounded-l-none"
              onClick={() => setRatingsOrScores("Scores")}
              disabled={ratingsOrScores === "Scores"}
            >
              Scores
            </Button>
          </div>
          <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
            <Table className="table-fixed h-20 overflow-y-auto dark:bg-transparent">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">Name</TableHead>
                  {groups && <TableHead className="w-36">Group</TableHead>}
                  {attributeIds.map(
                    (attributeId) => {
                      const attributeIdDisplay =
                        assessmentPart.part.attributeType === "Attribute" ?
                          attributeId.toUpperCase() :
                          attributeId
                      return <TableHead key={attributeId} className="w-12">{attributeIdDisplay}</TableHead>
                    }
                  )}
                </TableRow>
              </TableHeader>
              {group &&
                <GroupResultsDataTable
                  groupId={group.id}
                  attributeIds={attributeIds}
                  assessmentUsers={assessmentUsers}
                  ratingsOrScores={ratingsOrScores}
                />
              }
              {groups &&
                <AllGroupsResultsDataTable
                  groups={groups}
                  attributeIds={attributeIds}
                  assessmentUsers={assessmentUsers}
                  ratingsOrScores={ratingsOrScores}
                />
              }
            </Table>
          </div>
          <div className="w-full grid grid-cols-3">
            <span className="ml-4 text-base font-bold text-indigo-900/70 dark:text-indigo-100/70">
              Total Score
            </span>
            <span className="text-2xl text-center font-bold text-indigo-700 dark:text-indigo-300">
              {(totalScore && !isNaN(totalScore)) ? totalScore : "N/A"}
            </span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default function Results({
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

  const [exporting, setExporting] = useState<boolean>(false)
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
          const groupAssessmentUsers = assessmentUsersInPart.filter((assessmentUser) => {
            return assessmentUser.assessmentUserGroupId === group.id ||
              assessmentUser.participantParts.some(
                (participantPart) => participantPart.id === assessmentPart.id
              )
          })
          return (
            <ResultsAccordionItem
              key={group.id}
              assessmentPart={assessmentPart}
              group={group}
              attributeIds={attributeIds}
              assessmentUsers={groupAssessmentUsers}
              totalScore={groupTotalScore}
            />
          )
        })}
        <ResultsAccordionItem
          assessmentPart={assessmentPart}
          groups={groups}
          attributeIds={attributeIds}
          assessmentUsers={assessmentUsersInPart}
          totalScore={averageTotalScore}
        />
      </Accordion>
      <div className="mt-4 flex flex-col items-center space-y-8">
        <Button onClick={handleExport} disabled={exporting}>
          {exporting && <Loader className="mr-2 h-4 w-4 animate-spin" />} Export {assessmentPart.part.name} Results
        </Button>
      </div>
    </div>
  )
};