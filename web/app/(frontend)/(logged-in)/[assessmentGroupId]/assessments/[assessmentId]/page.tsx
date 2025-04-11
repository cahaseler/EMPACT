import Link from "next/link"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  fetchAssessment,
  fetchAssessmentParts,
  fetchAssessmentType,
} from "../../../utils/dataFetchers"
import {
  isAdmin,
  isLeadForAssessment,
  isManagerForCollection,
} from "../../../utils/permissions"
import AssessmentContent from "./assessment"

export default async function Page(
  props: Readonly<{
    params: { assessmentGroupId: string; assessmentId: string }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const parts = await fetchAssessmentParts(params.assessmentId)
  const permissions = session?.user?.assessmentUser.find(
    (assessmentUser) =>
      assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )?.permissions

  const canEdit =
    isAdmin(session) ||
    isManagerForCollection(session, assessment?.assessmentCollectionId) ||
    isLeadForAssessment(session, params.assessmentId) ||
    permissions?.find((permission) => permission.name === "Edit assessment") !==
      undefined

  if (assessmentType && assessment) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: assessmentType.name,
      },
    ]
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={assessment.name} />
            <div className="flex flex-row justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">
                  {assessment.name}
                </h1>
                <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                  {assessment.description}
                </p>
              </div>
              {/* TODO: Edit assessment functionality */}
              {canEdit && (
                <div>
                  <Link
                    href={`/${assessmentType.id}/assessments/${assessment.id}/edit-assessment`}
                    prefetch={false}
                    legacyBehavior>
                    <Button>Edit Assessment</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="mb-16">
          <AssessmentContent
            assessment={assessment}
            assessmentType={assessmentType}
            parts={parts}
            session={session}
          />
        </section>
      </div>
    );
  }
}
