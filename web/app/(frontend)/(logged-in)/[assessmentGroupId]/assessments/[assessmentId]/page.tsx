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
  isCollectionManager,
  isLeadForAssessment,
  isManagerForCollection,
  viewableCollections
} from "../../../utils/permissions"

import ArchiveModule from "../archive-module"
import AssessmentContent from "./assessment"
import EditModule from "../edit-module"
import SubmitModule from "../submit-module"

export default async function Page(
  props: Readonly<{
    params: { assessmentGroupId: string; assessmentId: string }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const collections = await viewableCollections(session, params.assessmentGroupId)
  const parts = await fetchAssessmentParts(params.assessmentId)
  const assessmentUser = session?.user?.assessmentUser.find(
    (assessmentUser) =>
      assessmentUser.assessmentId === parseInt(params.assessmentId, 10)
  )
  const permissions = assessmentUser?.permissions
  const group = await fetchAssessmentUserGroup(assessmentUser?.assessmentUserGroupId)

  if (assessmentType && assessment) {

    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: `${assessmentType.name} Assessments`,
      },
    ]

    const canEdit =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId) ||
      permissions?.find((permission) => permission.name === "Edit assessment") !==
      undefined
    const canEditCollection = isAdmin(session) || isCollectionManager(session)
    const canEditStatus =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId)
    const canArchive =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      permissions?.find(
        (permission) => permission.name === "Archive assessment"
      ) !== undefined

    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={assessment.name} />
            <div className="flex flex-col max-sm:space-y-2 sm:flex-row justify-between">
              <h1 className="text-3xl font-bold tracking-tighter">
                {assessment.name}
              </h1>
              <div className="flex flex-col space-y-2">
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
                      <EditModule
                        assessmentType={assessmentType}
                        assessment={assessment}
                        assessmentCollections={collections}
                        canEditCollection={canEditCollection}
                        canEditStatus={canEditStatus}
                        buttonType="default"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-row space-x-2 sm:justify-end">
                  {canEditStatus &&
                    <SubmitModule assessment={assessment} buttonType="default" />
                  }
                  {canArchive &&
                    <ArchiveModule
                      assessment={assessment}
                      assessmentTypeId={assessmentType.id}
                      buttonType="default"
                    />
                  }
                </div>
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
