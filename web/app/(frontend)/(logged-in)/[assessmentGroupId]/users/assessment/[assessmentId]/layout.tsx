import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotAuthorized from "@/app/(frontend)/components/notAuthorized"
import NotFound from "@/app/(frontend)/components/notFound"
import {
  fetchAssessment,
  fetchAssessmentType,
} from "../../../../utils/dataFetchers"

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode
    params: {
      assessmentGroupId: string
      assessmentId: string
    }
  }>
) {
  const params = await props.params

  const { children } = props

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const viewableStatuses = ["Planned", "Active", "Inactive"]

  if (assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/users`,
        name: assessmentType.name,
      },
    ]
    if (assessment) {
      if (viewableStatuses.includes(assessment.status)) {
        return children
      }
      return <NotAuthorized links={links} pageType={`${assessment.name} Users`} />
    }
    return <NotFound links={links} pageType="assessment" />
  }
}
