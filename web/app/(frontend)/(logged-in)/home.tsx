import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"


/** Page below is just a placeholder/proof of concept, needs to be replaced **/

// TODO: Define type of data
export function Home({ data }: Readonly<{data: any}>) {
  const assessmentCollections = data.assessmentCollections
  // TODO: Functionality for getting most recent assessment
  const mostRecentAssessment = data.assessmentCollections[0].assessments[2]
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-2 ml-2">
          <h1 className="text-3xl font-bold tracking-tighter">EMPACT</h1>
          <p className="text-base text-muted-foreground dark:text-indigo-300/80 md:text-lg/relaxed lg:text-sm/relaxed xl:text-base/relaxed">
            Environment and Maturity Program Assessment and Control Tool
          </p>
        </div>
      </section>
      <section className="mb-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold ml-2">Continue Recent Assessment</h2>
          <Link
            href={`/${assessmentCollections[0].id}/${mostRecentAssessment.id}`}
            className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-3 text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            {mostRecentAssessment.name}
          </Link>
        </div>
      </section>
      <section>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold ml-2">Previous Assessments</h2>
          <div className="grid gap-4">
            {assessmentCollections.map((collection: any) => {
              const completedAssessments = collection.assessments.filter(
                (assessment: any) => assessment.status === "Completed"
              )
              return(
                completedAssessments.map((assessment: any) => {
                return (
                  <AssessmentCard
                    groupId={collection.id}
                    id={assessment.id}
                    name={assessment.name}
                    completionDate={assessment.completionDate}
                    type={assessment.type}
                  />
                )
              }))
            })}
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
  type
}: {
  readonly groupId: number
  readonly id: number
  readonly name: string
  readonly completionDate: string
  readonly type: string
}) {
  return (
    <Card className="w-auto">
      <CardHeader className="flex justify-between">
        <div className="space-y-1">
          <CardTitle className="max-sm:text-center">
            <Link href={`/${groupId}/${id}`} className="hover:opacity-60" prefetch={false}>
              {name}
            </Link>
          </CardTitle>
          <CardDescription className="max-sm:text-center">Completed on {completionDate}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 max-sm:space-y-2 justify-start">
          <Link
            href="#"
            // TODO: Link to report (href={`/reports/${id}`})
            className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-primary hover:bg-indigo-100 dark:hover:bg-indigo-400/30 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            View Report
          </Link>
          {type !== "Environment" && <Link
            href={`/${groupId}/${id}/maturity`}
            className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-primary hover:bg-indigo-100 dark:hover:bg-indigo-400/30 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Maturity
          </Link>}
          {type !== "Maturity" && <Link
            href={`/${groupId}/${id}/environment`}
            className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-primary hover:bg-indigo-100 dark:hover:bg-indigo-400/30 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Environment
          </Link>}
        </div>
      </CardHeader>
    </Card>
  )
}