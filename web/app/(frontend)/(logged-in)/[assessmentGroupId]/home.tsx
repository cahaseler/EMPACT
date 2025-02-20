import { Session } from "next-auth"
import { 
  AssessmentType, 
  Assessment, 
  Part,
  Section,
  Attribute,
  AssessmentUserResponse
} from "@/prisma/mssql/generated/client"

import { isParticipantForAssessment } from "../utils/permissions"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home({ 
  assessmentType, 
  assessments,
  parts,
  userResponses,
  session
}: Readonly<{
    assessmentType: AssessmentType | null, 
    assessments: Assessment[],
    parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
    userResponses: AssessmentUserResponse[],
    session: Session | null
  }>) {
  if (assessmentType) {

    const mostRecentAssessment = assessments.filter(
      (assessment: Assessment) => assessment.status === "Active"
    ).sort(
      (a: Assessment, b: Assessment) => b.date.valueOf() - a.date.valueOf()
    )[0]
    const mostRecentResponseAttributeIds = userResponses.filter(
      (userResponse: AssessmentUserResponse) => userResponse.assessmentId === mostRecentAssessment.id
    ).sort(
      (a: AssessmentUserResponse, b: AssessmentUserResponse) => a.levelId - b.levelId
    ).map(
      (userResponse: AssessmentUserResponse) => userResponse.attributeId
    )
    const nextPart = parts.find(part => part.sections.find(section => section.attributes.find(attribute => !mostRecentResponseAttributeIds.includes(attribute.id))))
    const nextSection = nextPart?.sections.find(section => section.attributes.find(attribute => !mostRecentResponseAttributeIds.includes(attribute.id)))
    const nextAttribute = nextSection?.attributes.find(attribute => !mostRecentResponseAttributeIds.includes(attribute.id))

    const completedAssessments = assessments.filter(
      (assessment: Assessment) => assessment.status === "Completed"
    )

    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">{assessmentType.name}</h1>
            <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
              {assessmentType.description}
            </p>
          </div>
        </section>
        {(mostRecentAssessment && isParticipantForAssessment(session, mostRecentAssessment.id.toString())) && <section className="mb-16">
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold">Continue Recent Assessment</h2>
            <Link
              href={`/${assessmentType.id}/assessments/${mostRecentAssessment.id}/${nextPart ? nextPart.name : parts[0].name}/${nextSection ? nextSection.id : parts[0].sections[0].id}/${nextAttribute ? nextAttribute.id : parts[0].sections[0].attributes[0].id}` }
              prefetch={false}
            >
              <Button>{mostRecentAssessment.name}</Button>
            </Link>
          </div>
        </section>}
        <section>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Previous Assessments</h2>
            <div className="grid gap-4">
              {completedAssessments.length > 0 ? completedAssessments.map((assessment: Assessment, key: number) => {
                  return (
                    <AssessmentCard
                      key={key}
                      groupId={assessmentType.id}
                      id={assessment.id}
                      name={assessment.name}
                      date={`${assessment.date.getMonth() + 1}/${assessment.date.getDate()}/${assessment.date.getFullYear()}`}
                      parts={parts}
                      session={session}
                    />
                  )}) : (
                    <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                      No completed assessments.
                    </p>)
              }
            </div>
          </div>
        </section>
      </div>
    )
  }
}

function AssessmentCard({
  groupId,
  id,
  name,
  date,
  parts,
  session
}: {
  readonly groupId: number
  readonly id: number
  readonly name: string
  readonly date: string
  readonly parts: any[]
  readonly session: Session | null
}) {
  const role = isParticipantForAssessment(session, id.toString()) ? "Participant" : "Facilitator"
  return (
    <Card className="w-auto">
      <CardHeader className="flex justify-between">
        <div className="space-y-1">
          <CardTitle className="max-sm:text-center">
            <Link href={`/${groupId}/assessments/${id}`} className="hover:opacity-60" prefetch={false}>
              {name}
            </Link>
          </CardTitle>
          <CardDescription className="max-sm:text-center">Completed on {date}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 max-sm:space-y-2 justify-start">
          <Link
            href={`/${groupId}/reports/${id}`}
            prefetch={false}
          >
            <Button variant="secondary">
              View Report
            </Button>
          </Link>
          {parts.map((part : Part) => {
            return (
              <Link
                href={`/${groupId}/assessments/${id}/${role}/${part.name}`}
                prefetch={false}
              >
                <Button variant="secondary">
                  {part.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </CardHeader>
    </Card>
  )
}