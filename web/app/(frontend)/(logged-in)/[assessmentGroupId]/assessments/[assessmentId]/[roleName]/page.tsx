import NotFound from "@/app/(frontend)/components/notFound"
import {
  fetchAssessment,
  fetchAssessmentType,
} from "../../../../utils/dataFetchers"

export default async function Page(
  props: Readonly<{
    params: {
      assessmentGroupId: string
      assessmentId: string
      roleName: string
    }
  }>
) {
  const params = await props.params
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)

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
    return <NotFound links={links} pageType="part" />
  }
}
