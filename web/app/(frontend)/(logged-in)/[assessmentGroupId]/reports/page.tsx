import { auth } from "@/auth"
import { fetchAssessmentType } from "../../utils/dataFetchers"
import { viewableAssessments } from "../../utils/permissions"
import { DataTable } from "./data-table"

export default async function Page(
  props: Readonly<{ params: { assessmentGroupId: string } }>
) {
  const params = await props.params
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessments = await viewableAssessments(
    session,
    params.assessmentGroupId
  )

  if (assessmentType) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              {assessmentType.name} Reports
            </h1>
            <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
              Select an assessment from the list below to view its report.
            </p>
          </div>
        </section>
        <section className="mb-16">
          <div className="space-y-4">
            <DataTable
              assessments={assessments}
              assessmentType={assessmentType}
            />
          </div>
        </section>
      </div>
    )
  }
}
