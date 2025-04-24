import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import { auth } from "@/auth"
import {
  fetchAssessment,
  fetchAssessmentType,
  fetchPart,
} from "../../../../../../utils/dataFetchers"
import { viewableResponses } from "../../../../../../utils/permissions"
import Sections from "./sections"

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

  const userResponses = await viewableResponses(
    session,
    params.assessmentId,
    params.roleName
  )

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

    const partAttributeIds = part.sections.flatMap(
      section => section.attributes.map(
        attribute => attribute.id
      )
    )
    const responsesInPart = userResponses.filter(
      response => partAttributeIds.includes(response.attributeId)
    )
    const assessmentAttributesInPart = assessment.assessmentAttributes.filter(
      assessmentAttribute => partAttributeIds.includes(assessmentAttribute.attributeId)
    )
    const hasUserSubmittedAllResponses = responsesInPart.length === assessmentAttributesInPart.length

    if (hasUserSubmittedAllResponses) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs
                links={links}
                currentPage={`Review All ${part.name} Responses`}
              />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">
                  Review All {part.name} Responses
                </h1>
                <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                  If you need to edit a response, select it from the table below. Once all responses appear correct, click the submit button.
                </p>
              </div>
            </div>
          </section>
          <section className="mb-16">
            <Sections
              assessmentTypeId={assessmentType.id}
              assessmentId={assessment.id}
              part={part}
              assessmentAttributes={assessment.assessmentAttributes}
              userResponses={userResponses}
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