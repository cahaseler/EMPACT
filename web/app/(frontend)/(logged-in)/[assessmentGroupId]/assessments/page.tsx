import Link from "next/link"

import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { fetchAssessmentType } from "../../utils/dataFetchers"
import {
  isAdmin,
  isCollectionManager,
  viewableAssessments,
  viewableCollections
} from "../../utils/permissions"
import AssessmentsDataTable from "./data-table"

export default async function Page(
  props: Readonly<{ params: { assessmentGroupId: string } }>
) {
  const params = await props.params
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const collections = await viewableCollections(
    session,
    params.assessmentGroupId
  )
  const assessments = await viewableAssessments(
    session,
    params.assessmentGroupId
  )

  const canAdd = isAdmin(session) || isCollectionManager(session)

  if (assessmentType) {
    const nonArchivedAssessments = assessments.filter(
      assessment => assessment.status !== "Archived"
    )
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <div className="flex flex-col max-sm:space-y-2 sm:flex-row justify-between">
              <h1 className="text-3xl font-bold tracking-tighter">
                {assessmentType.name} Assessments
              </h1>
              {canAdd && (
                <div className="flex flex-col h-fit max-sm:space-y-2 sm:flex-row sm:space-x-2 justify-end">
                  <Link
                    href={`/${assessmentType.id}/assessments/manage-collections`}
                    prefetch={false}
                  >
                    <Button>Manage Assessment Collections</Button>
                  </Link>
                  <Link
                    href={`/${assessmentType.id}/assessments/add-assessment`}
                    prefetch={false}
                  >
                    <Button>Add Assessment</Button>
                  </Link>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
              Select an assessment from the list below to enter the assessment.
            </p>
          </div>
        </section>
        <section className="mb-16">
          <div className="space-y-4">
            <AssessmentsDataTable
              assessments={nonArchivedAssessments}
              assessmentType={assessmentType}
              collections={collections}
              session={session}
            />
          </div>
        </section>
      </div>
    )
  }
}
