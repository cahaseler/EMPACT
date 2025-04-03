import { Session } from "@/auth"
import { format } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Assessment,
  AssessmentType,
  AssessmentUserResponse,
  Attribute,
  Part,
  Section,
} from "@/prisma/mssql/generated/client"
import { isParticipantForAssessment } from "../utils/permissions"

export default function Home({
  assessmentType,
  assessments,
  parts,
  userResponses,
  session,
}: Readonly<{
  assessmentType: AssessmentType | null
  assessments: Assessment[]
  parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
  userResponses: AssessmentUserResponse[]
  session: Session | null
}>) {
  if (assessmentType) {
    const mostRecentAssessment = assessments
      .filter((assessment: Assessment) => assessment.status === "Active")
      .sort(
        (a: Assessment, b: Assessment) =>
          (b.completedDate?.valueOf() ?? 0) - (a.completedDate?.valueOf() ?? 0)
      )[0]
    const mostRecentResponseAttributeIds = userResponses
      .filter(
        (userResponse: AssessmentUserResponse) =>
          // Check if mostRecentAssessment is defined before accessing its id
          mostRecentAssessment && userResponse.assessmentId === mostRecentAssessment.id
      )
      .sort(
        (a: AssessmentUserResponse, b: AssessmentUserResponse) =>
          a.levelId - b.levelId
      )
      .map((userResponse: AssessmentUserResponse) => userResponse.attributeId)
    const nextPart = parts.find((part) =>
      part.sections.find((section) =>
        section.attributes.find(
          (attribute) => !mostRecentResponseAttributeIds.includes(attribute.id)
        )
      )
    )
    const nextSection = nextPart?.sections.find((section) =>
      section.attributes.find(
        (attribute) => !mostRecentResponseAttributeIds.includes(attribute.id)
      )
    )
    const nextAttribute = nextSection?.attributes.find(
      (attribute) => !mostRecentResponseAttributeIds.includes(attribute.id)
    )

    const completedAssessments = assessments.filter(
      (assessment: Assessment) => assessment.status === "Final"
    )

    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              {assessmentType.name}
            </h1>
            <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
              {assessmentType.description}
            </p>
          </div>
        </section>
        {mostRecentAssessment &&
          isParticipantForAssessment(
            session,
            mostRecentAssessment.id.toString()
          ) && (
            <section className="mb-16">
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl font-bold">
                  Continue Recent Assessment
                </h2>
                {(() => {
                  // Calculate link parts safely using optional chaining and nullish coalescing
                  const targetPartName: string | undefined = nextPart?.name ?? parts?.[0]?.name;
                  // Ensure sectionId is treated as string for URL
                  const targetSectionId: string | undefined = nextSection?.id?.toString() ?? parts?.[0]?.sections?.[0]?.id?.toString();
                  const targetAttributeId: string | undefined = nextAttribute?.id ?? parts?.[0]?.sections?.[0]?.attributes?.[0]?.id;

                  // Check if all necessary components for the URL are defined
                  const canConstructLink = assessmentType?.id && mostRecentAssessment?.id && targetPartName && targetSectionId && targetAttributeId;

                  if (canConstructLink) {
                    // Construct the URL only if all parts are valid
                    const continueLink = `/${assessmentType.id}/assessments/${mostRecentAssessment.id}/${targetPartName}/${targetSectionId}/${targetAttributeId}`;
                    return (
                      <Link href={continueLink} prefetch={false}>
                        <Button>{mostRecentAssessment.name}</Button>
                      </Link>
                    );
                  }
                  // Return null or some fallback UI if the link cannot be constructed
                  return null;
                })()}
              </div>
            </section>
          )}
        <section className="mb-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Previous Assessments</h2>
            <div className="grid gap-4">
              {completedAssessments.length > 0 ? (
                completedAssessments
                  .filter((assessment): assessment is Assessment & { completedDate: Date } => assessment.completedDate !== null)
                  .map(
                    (assessment, key: number) => {
                      return (
                        <AssessmentCard
                          key={key}
                          groupId={assessmentType.id}
                          id={assessment.id}
                          name={assessment.name}
                          completedDate={assessment.completedDate}
                          parts={parts}
                          session={session}
                        />
                      )
                    }
                  )
              ) : (
                <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                  No completed assessments.
                </p>
              )}
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
  completedDate,
  parts,
  session,
}: {
  readonly groupId: number
  readonly id: number
  readonly name: string
  readonly completedDate: Date
  readonly parts: any[]
  readonly session: Session | null
}) {
  const role = isParticipantForAssessment(session, id.toString())
    ? "Participant"
    : "Facilitator"
  return (
    <Card className="w-auto">
      <CardHeader className="flex justify-between flex justify-between space-y-4 ml-2">
        <div className="flex flex-col space-y-2 max-sm:items-center">
          <CardTitle className="max-sm:text-center">
            <Link
              href={`/${groupId}/assessments/${id}`}
              className="hover:opacity-60"
              prefetch={false}
            >
              {name}
            </Link>
          </CardTitle>
          <CardDescription className="max-sm:text-center">
            Completed on {format(completedDate, "MM/dd/yyyy")}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 max-sm:space-y-2 justify-start">
          <Link href={`/${groupId}/reports/${id}`} prefetch={false}>
            <Button variant="secondary">View Report</Button>
          </Link>
          {parts.map((part: Part) => {
            return (
              <Link
                href={`/${groupId}/assessments/${id}/${role}/${part.name}`}
                prefetch={false}
                key={part.name}
              >
                <Button variant="secondary">{part.name}</Button>
              </Link>
            )
          })}
        </div>
      </CardHeader>
    </Card>
  )
}
