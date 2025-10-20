import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import {
  fetchAssessment,
  fetchAssessmentPart,
  fetchAssessmentType,
  fetchAssessmentUsers,
  fetchAssessmentUserGroups,
  fetchPart,
} from "../../../../../../utils/dataFetchers"
import {
  isAdmin,
  isManagerForCollection,
  isLeadForAssessment
} from "../../../../../../utils/permissions"

import Groups from "./groups"

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

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)

  if (assessmentType && assessment && part) {

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

    const assessmentPart = await fetchAssessmentPart(assessment.id, part.id)

    const partAttributeIds = part.sections.flatMap(
      section => section.attributes.map(
        attribute => attribute.id
      )
    )
    const assessmentAttributesInPart = assessment.assessmentAttributes.filter(
      assessmentAttribute => partAttributeIds.includes(assessmentAttribute.attributeId)
    )

    const canSubmit =
      isAdmin(session) ||
      isManagerForCollection(session, assessment.assessmentCollectionId) ||
      isLeadForAssessment(session, params.assessmentId)

    if (assessmentPart) {
      if (canSubmit) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
              <div className="space-y-4 max-lg:ml-2">
                <Breadcrumbs
                  links={links}
                  currentPage={`Submit Assessment Part`}
                />
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter">
                    {assessment.name} {part.name} Assessment Scores
                  </h1>
                </div>
              </div>
            </section>
            <section className="mb-16">
              <Groups
                assessmentId={assessment.id}
                assessmentPart={assessmentPart}
                part={part}
                assessmentUsers={assessmentUsers}
                groups={groups}
                assessmentAttributes={assessmentAttributesInPart}
                urlHead={
                  `/${assessmentType.id}/assessments/${assessment.id}/${params.roleName}/${part.name}`
                }
              />
            </section>
          </div>
        )
      }
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={part.name} />
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