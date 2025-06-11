import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"

import { auth } from "@/auth"

import {
  fetchAssessment,
  fetchAssessmentAttributes,
  fetchAssessmentPart,
  fetchAssessmentType,
  fetchPart
} from "../../../../../../utils/dataFetchers"
import {
  isAdmin,
  isLeadForAssessment,
  isManagerForCollection
} from "../../../../../../utils/permissions"

import AssessmentAttributes from "./attributes"
import EditForm from "./edit-form"

export default async function Page(
  props: Readonly<{
    params: {
      assessmentGroupId: string
      assessmentId: string
      roleName: string
      partName: string
    }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const assessmentAttributes = await fetchAssessmentAttributes(params.assessmentId)

  if (assessmentType && assessment && part) {
    const assessmentPart = await fetchAssessmentPart(assessment.id, part.id)
    if (assessmentPart) {

      const links = [
        {
          url: `/${assessmentType.id}/assessments`,
          name: `${assessmentType.name} Assessments`,
        },
        {
          url: `/${assessmentType.id}/assessments/${assessment.id}`,
          name: assessment.name,
        },
        {
          url: `/${assessmentType.id}/assessments/${assessment.id}/${params.roleName}/${part.name}`,
          name: `${part.name} Assessment`,
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

      if (canEdit) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
              <div className="space-y-4">
                <Breadcrumbs links={links} currentPage="Edit Assessment Part" />
                <div className="flex flex-row justify-between">
                  <h1 className="text-3xl font-bold tracking-tighter">Edit {assessment.name} {part.name} Assessment</h1>
                </div>
              </div>
            </section>
            <section className="mb-8">
              <EditForm
                assessmentPart={assessmentPart}
              />
            </section>
            <section className="mb-16">
              <AssessmentAttributes
                assessmentId={assessment.id}
                part={part}
                assessmentAttributes={assessmentAttributes}
              />
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
}
