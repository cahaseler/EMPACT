import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"

import { auth } from "@/auth"

import {
  fetchAllResponsesForAssessment,
  fetchAssessment,
  fetchAssessmentAttributes,
  fetchAssessmentCollections,
  fetchAssessmentParts,
  fetchAssessmentType,
  fetchAssessmentUsers
} from "../../../../utils/dataFetchers"
import {
  isAdmin,
  isCollectionManager,
  isLeadForAssessment,
  isManagerForCollection,
  viewableCollections
} from "../../../../utils/permissions"

import AssessmentAttributes from "./attributes"
import ArchiveModule from "../../archive-module"
import EditForm from "./edit-form"
import PartsTable from "./parts-table"
import SubmitModule from "./submit-module"

export default async function Page(
  props: Readonly<{
    params: {
      assessmentGroupId: string
      assessmentId: string
    }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessmentCollections = await fetchAssessmentCollections(
    params.assessmentGroupId
  )
  const editableCollections = await viewableCollections(
    session,
    params.assessmentGroupId
  )
  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentParts = await fetchAssessmentParts(params.assessmentId)
  const parts = assessmentParts.map(part => part.part)
  const assessmentAttributes = await fetchAssessmentAttributes(params.assessmentId)
  const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)
  const userResponses = await fetchAllResponsesForAssessment(params.assessmentId)

  if (assessmentType && assessment) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: `${assessmentType.name} Assessments`,
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name,
      },
    ]
    const permissions = session?.user?.assessmentUser.find(
      (assessmentUser) => assessmentUser.assessmentId === assessment.id
    )?.permissions
    const canEdit =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId) ||
      permissions?.find(
        (permission) => permission.name === "Edit assessment"
      ) !== undefined
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
    if (canEdit) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4">
              <Breadcrumbs links={links} currentPage="Edit Assessment" />
              <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold tracking-tighter">Edit {assessment.name}</h1>
                <div className="flex flex-col sm:flex-row justify-end max-sm:space-y-4 sm:space-x-4 ml-4">
                  {canEditStatus && <SubmitModule assessment={assessment} />}
                  {canArchive &&
                    <ArchiveModule
                      assessment={assessment}
                      assessmentTypeId={assessmentType.id}
                      assessmentUsers={assessmentUsers}
                      buttonType="default"
                    />
                  }
                </div>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <EditForm
              assessmentType={assessmentType}
              assessment={assessment}
              assessmentCollections={canEditCollection ? editableCollections : assessmentCollections}
              canEditCollection={canEditCollection}
              canEditStatus={canEditStatus}
            />
          </section>
          <section className="mb-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold max-lg:ml-2">Assessment Parts</h2>
              <PartsTable
                assessmentParts={assessmentParts}
                canEditStatus={canEditStatus}
                assessmentUsers={assessmentUsers}
                userResponses={userResponses}
              />
              <AssessmentAttributes
                assessmentId={assessment.id}
                parts={parts}
                assessmentAttributes={assessmentAttributes}
              />
            </div>
          </section>
        </div >
      )
    }
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs
              links={links}
              currentPage={`Edit ${assessment.name}`}
            />
            <p className="text-md text-muted-foreground dark:text-indigo-300/80">
              You are not authorized to view this page.
            </p>
          </div>
        </section>
      </div>
    )
  }
}
