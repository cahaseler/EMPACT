"use client"

import {
  User,
  AssessmentAttribute,
  AssessmentPart,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Level,
  Part,
  Section,
  Attribute
} from "@/prisma/mssql/generated/client"
import {
  updateAssessmentPart,
  createAssessmentPartFinalizedDate,
  createScoreSummaries
} from "../../../../../../utils/dataActions"
import { calculateTotalScore } from "../../../../../../utils/dataCalculations"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

import DataTable from "./data-table"

export default function Groups({
  assessmentId,
  assessmentPart,
  part,
  assessmentUsers,
  groups,
  assessmentAttributes,
}: {
  readonly assessmentId: number
  readonly assessmentPart: AssessmentPart
  readonly part: Part
  readonly assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & { level: Level })[]
    },
    participantParts: AssessmentPart[]
  })[]
  readonly groups: AssessmentUserGroup[]
  readonly assessmentAttributes: (AssessmentAttribute & {
    attribute: Attribute & {
      levels: Level[],
      section: Section & { part: Part & { assessmentPart: AssessmentPart[] } }
    }
  })[]
}) {
  const attributesOfAssessmentAttributes = assessmentAttributes.map(assessmentAttribute => assessmentAttribute.attribute)

  const groupTotalScores = groups.map(group => {
    return calculateTotalScore(
      assessmentId,
      assessmentPart.id,
      group.id,
      attributesOfAssessmentAttributes,
      assessmentUsers
    )
  })
  const someScoreNotANumber = groupTotalScores.some(groupTotalScore => isNaN(groupTotalScore.score))
  const averageTotalScore = Math.round(groupTotalScores.reduce(
    (total, groupTotalScore) => total + groupTotalScore.score, 0
  ) / groupTotalScores.length)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateAssessmentPart(
      assessmentPart.id,
      "Final",
      assessmentPart.date,
      assessmentId,
      part.id
    ).then(async () => {
      await createAssessmentPartFinalizedDate(assessmentPart.id).then(async () => {
        await createScoreSummaries(groupTotalScores).then(() => {
          router.refresh()
          toast({
            title: "Assessment part finalized successfully.",
          })
        }).catch(error => {
          toast({
            title: `Error finalizing assessment part: ${error}`
          })
        })
      }).catch(error => {
        toast({
          title: `Error finalizing assessment part: ${error}`
        })
      })
    }).catch(error => {
      toast({
        title: `Error finalizing assessment part: ${error}`
      })
    })
  }

  return (
    <div className="flex flex-col space-y-4">
      <Accordion
        type="single"
        collapsible={true}
        className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
      >
        {groups.map(group => {
          const groupTotalScore = groupTotalScores.find(
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
                <DataTable
                  groupId={group.id}
                  part={part}
                  attributes={attributesOfAssessmentAttributes}
                  assessmentUsers={groupAssessmentUsers}
                  groupTotalScore={groupTotalScore}
                />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      <div className="flex flex-col items-center space-y-8">
        <span className="text-2xl text-left font-bold text-indigo-800 dark:text-indigo-300">
          Average Total Score: {(averageTotalScore && !isNaN(averageTotalScore)) ? averageTotalScore : "N/A"}
        </span>
        {someScoreNotANumber ?
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="cursor-default opacity-50">
                  Finalize Assessment Part
                </Button>
              </TooltipTrigger>
              <TooltipContent className="w-60 text-center">
                In order to finalize this assessment part, all groups must have a valid total score.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          :
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Finalize Assessment Part</Button>
            </AlertDialogTrigger>
            <AlertDialogPortal>
              <AlertDialogOverlay />
              <AlertDialogContent>
                <div className="flex flex-col space-y-6 text center">
                  <AlertDialogTitle>Finalize Assessment Part</AlertDialogTitle>
                  <p>
                    Are you sure you want to finalize this assessment part?
                  </p>
                  <div className="flex flex-row space-x-2 justify-end">
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button onClick={(e: React.FormEvent) => handleSubmit(e)}>
                        Finalize
                      </Button>
                    </AlertDialogAction>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialogPortal>
          </AlertDialog>
        }
      </div>
    </div>
  )
}