"use client"

import { useState } from "react"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import {
  Assessment,
  AssessmentAttribute,
  AssessmentPart,
  AssessmentType,
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
import Responses from "./responses"
import Results from "./results"

export default function PageView({
  assessmentType,
  assessment,
  responses,
  groups,
  assessmentUsers,
  scores
}: {
  readonly assessmentType: AssessmentType
  readonly assessment: Assessment & {
    assessmentParts: (AssessmentPart & { part: Part })[],
    assessmentAttributes: (AssessmentAttribute & {
      attribute: Attribute & {
        levels: Level[],
        section: Section & {
          part: Part & {
            assessmentPart: AssessmentPart[]
          }
        }
      }
    })[]
  }
  readonly responses: (AssessmentUserResponse & {
    user: User,
    assessmentUserGroup: AssessmentUserGroup | null,
    level: Level
  })[]
  readonly groups: AssessmentUserGroup[]
  readonly assessmentUsers: (AssessmentUser & {
    user: User & {
      assessmentUserResponse: (AssessmentUserResponse & { level: Level })[]
    },
    participantParts: AssessmentPart[]
  })[]
  readonly scores: ScoreSummary[]
}) {

  const links = [
    {
      url: `/${assessmentType.id}/assessments`,
      name: `${assessmentType.name} Assessments`,
    },
    {
      url: `/${assessmentType.id}/assessments/${assessment.id}`,
      name: assessment.name,
    },
  ]

  const [responsesOrResults, setResponsesOrResults] = useState<
    "responses" | "results"
  >("responses")

  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-4 max-lg:ml-2">
          <Breadcrumbs
            links={links}
            currentPage={`Export Assessment Data`}
          />
          <div className="flex flex-col max-md:space-y-2 md:flex-row md:space-x-4 justify-between">
            <h1 className="text-3xl font-bold tracking-tighter">
              {assessment.name} Data
            </h1>
            <div className="flex flex-row">
              <Button
                className="rounded-r-none"
                onClick={() => setResponsesOrResults("responses")}
                disabled={responsesOrResults === "responses"}
              >
                Responses
              </Button>
              <Button
                className="rounded-l-none"
                onClick={() => setResponsesOrResults("results")}
                disabled={responsesOrResults === "results"}
              >
                Results
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
            {assessment.description}
          </p>
        </div>
      </section>
      <section className="mb-16">
        <div className="space-y-4">
          {responsesOrResults === "responses" && (
            assessment.assessmentParts.map(assessmentPart => {
              return (
                <Responses
                  assessment={assessment}
                  assessmentPart={assessmentPart}
                  responses={responses}
                />
              )
            })
          )}
          {responsesOrResults === "results" && (
            assessment.assessmentParts.map(assessmentPart => {
              return (
                <Results
                  assessment={assessment}
                  assessmentPart={assessmentPart}
                  groups={groups}
                  assessmentUsers={assessmentUsers}
                  scores={scores}
                />
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
