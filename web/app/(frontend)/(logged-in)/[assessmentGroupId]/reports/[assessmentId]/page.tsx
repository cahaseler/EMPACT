import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import {
  fetchAssessment,
  fetchAssessmentType,
  fetchAssessmentUserGroups,
  fetchScoreSummaries
} from "../../../utils/dataFetchers"
import AssessmentReport from "./report"

export default async function Page(
  props: Readonly<{
    params: { assessmentGroupId: string; assessmentId: string }
  }>
) {
  const params = await props.params
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)
  const scores = await fetchScoreSummaries(params.assessmentId)

  if (assessmentType && assessment && groups && scores) {
    const links = [
      {
        url: `/${assessmentType.id}/reports`,
        name: `${assessmentType.name} Reports`,
      },
    ]
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs
              links={links}
              currentPage={`${assessment.name} Reports`}
            />
            <div className="flex flex-row justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">
                  {assessment.name} Reports
                </h1>
                <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                  {assessment.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <AssessmentReport
            assessmentId={assessment.id}
            groups={groups}
            scores={scores}
            assessmentAttributes={assessment.assessmentAttributes}
          />
        </section>
      </div>
    )
  }
}
