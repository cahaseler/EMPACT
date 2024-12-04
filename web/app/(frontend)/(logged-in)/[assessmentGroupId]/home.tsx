import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"


/** Page below is just a placeholder/proof of concept, needs to be replaced **/

// TODO: Define types of data
export function Home({ assessmentCollection }: Readonly<{assessmentCollection: any}>) {
  // TODO: Functionality for getting most recent assessment
  const mostRecentAssessment = assessmentCollection.assessments[2]
  const completedAssessments = assessmentCollection.assessments.filter(
    (assessment: any) => assessment.status === "Completed"
  )
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">{assessmentCollection.name}</h1>
          <p className="text-lg text-muted-foreground dark:text-indigo-300/80">
            {assessmentCollection.description}
          </p>
        </div>
      </section>
      <section className="mb-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Continue Recent Assessment</h2>
          <Link
            href={`/${assessmentCollection.id}/assessments/${mostRecentAssessment.id}`}
            className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-3 text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            {mostRecentAssessment.name}
          </Link>
        </div>
      </section>
      <section>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Previous Assessments</h2>
          <div className="grid gap-4">
            {
              completedAssessments.map((assessment: any) => {
                return (
                  <AssessmentCard
                    groupId={assessmentCollection.id}
                    id={assessment.id}
                    name={assessment.name}
                    completionDate={assessment.completionDate}
                    types={assessment.types}
                  />
                )})
            }
          </div>
        </div>
      </section>
    </div>
  )
}

function AssessmentCard({
  groupId,
  id,
  name,
  completionDate,
  types
}: {
  readonly groupId: number
  readonly id: number
  readonly name: string
  readonly completionDate: string
  readonly types: string[]
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
          <CardDescription className="max-sm:text-center">Completed on {completionDate}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 max-sm:space-y-2 justify-start">
          <Link
            href={`/${groupId}/reports/${id}`}
            className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-primary hover:bg-indigo-100 dark:hover:bg-indigo-400/30 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            View Report
          </Link>
          {types.map((type : string) => {
            return (
              <Link
                href={`/${groupId}/assessments/${id}/${type}`}
                className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-primary hover:bg-indigo-100 dark:hover:bg-indigo-400/30 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                {type}
              </Link>
            )
          })}
        </div>
      </CardHeader>
    </Card>
  )
}