import Link from "next/link"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  fetchAssessment,
  fetchAssessmentParts,
  fetchAssessmentType,
  fetchAssessmentUserGroup
} from "../../../utils/dataFetchers"
import {
  canViewUsers,
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
  const assessmentUser = session?.user?.assessmentUser.find(
    (assessmentUser) =>
      assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )
  const permissions = assessmentUser?.permissions
  const group = await fetchAssessmentUserGroup(assessmentUser?.assessmentUserGroupId)

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
        name: `${assessmentType.name} Assessments`,
      },
    ]
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={assessment.name} />
            <div className="flex flex-col max-sm:space-y-2 sm:flex-row justify-between">
              <h1 className="text-3xl font-bold tracking-tighter">
                {assessment.name}
              </h1>
              <div className="flex flex-row space-x-2">
                {canViewUsers(session) && (
                  <div>
                    <Link
                      href={`/${assessmentType.id}/users/assessment/${assessment.id}`}
                      prefetch={false}
                    >
                      <Button>Manage Assessment Users</Button>
                    </Link>
                  </div>
                )}
                {canEdit && (
                  <div>
                    <Link
                      href={`/${assessmentType.id}/assessments/${assessment.id}/edit-assessment`}
                      prefetch={false}
                    >
                      <Button>Edit Assessment</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
              {assessment.description}
            </p>
          </div>
        </section>
        <section className="mb-16">
          <AssessmentContent
            assessment={assessment}
            assessmentType={assessmentType}
            group={group}
            parts={parts}
            session={session}
          />
        </section>
      </div>
    )
  }
}
