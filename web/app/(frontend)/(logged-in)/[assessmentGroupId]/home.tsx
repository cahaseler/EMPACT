import { AssessmentType, Assessment, Part } from "@/prisma/mssql/generated/client"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export function Home({ 
  assessmentType, 
  assessments,
  parts 
}: Readonly<{
    assessmentType: AssessmentType | null, 
    assessments: Assessment[],
    parts: Part[]
  }>) {
  if (assessmentType) {
    // TODO: Functionality for getting most recent assessment
    const mostRecentAssessment = assessments.filter(
      (assessment: Assessment) => assessment.status === "In Progress"
    )[0]
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
        {mostRecentAssessment && <section className="mb-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Continue Recent Assessment</h2>
            <Link
              href={`/${assessmentType.id}/assessments/${mostRecentAssessment.id}`}
              className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-3 text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              {mostRecentAssessment.name}
            </Link>
          </div>
        </section>}
        <section>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Previous Assessments</h2>
            <div className="grid gap-4">
              {completedAssessments.map((assessment: Assessment, key: number) => {
                  return (
                    <AssessmentCard
                      key={key}
                      groupId={assessmentType.id}
                      id={assessment.id}
                      name={assessment.name}
                      date={`${assessment.date.getMonth() + 1}/${assessment.date.getDate()}/${assessment.date.getFullYear()}`}
                      parts={parts}
                    />
                  )})
              }
            </div>
          </div>
        </section>
      </div>
    )
  }
  return (
    <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
            <div className="space-y-8 max-lg:ml-2">
                <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                    The assessment type could not be found.
                </p>
            </div>
        </section>
    </div>
  )
}

function AssessmentCard({
  groupId,
  id,
  name,
  date,
  parts
}: {
  readonly groupId: number
  readonly id: number
  readonly name: string
  readonly date: string
  readonly parts: any[]
}) {
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
            className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-primary hover:bg-indigo-100 dark:hover:bg-indigo-400/30 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            View Report
          </Link>
          {parts.map((part : Part) => {
            return (
              <Link
                href={`/${groupId}/assessments/${id}/${part.name}`}
                className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-primary hover:bg-indigo-100 dark:hover:bg-indigo-400/30 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                {part.name}
              </Link>
            )
          })}
        </div>
      </CardHeader>
    </Card>
  )
}