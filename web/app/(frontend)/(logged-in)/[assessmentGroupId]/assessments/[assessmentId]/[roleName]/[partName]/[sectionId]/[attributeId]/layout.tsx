import { propagateServerField } from "next/dist/server/lib/render-server"
import {
  fetchAssessmentType,
  fetchAssessment,
  fetchPart,
  fetchSection,
  fetchAssessmentAttribute
} from "../../../../../../../utils/dataFetchers"
import NotFound from "@/app/(frontend)/components/notFound"

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode
    params: {
      assessmentGroupId: string
      assessmentId: string
      roleName: string
      partName: string
      sectionId: string
      attributeId: string
    }
  }>
) {
  const params = await props.params

  const { children } = props

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const attribute = await fetchAssessmentAttribute(params.assessmentId, params.attributeId)

  if (assessmentType && assessment && part && section) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: assessmentType.name
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}/${params.roleName}/${part.name}`,
        name: part.name
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}/${params.roleName}/${part.name}/${section.id}`,
        name: `${section.id.toString().toUpperCase()}. ${section.name}`
      }
    ]
    if (attribute) {
      return children
    }
    return <NotFound links={links} pageType="attribute" />
  }
}
