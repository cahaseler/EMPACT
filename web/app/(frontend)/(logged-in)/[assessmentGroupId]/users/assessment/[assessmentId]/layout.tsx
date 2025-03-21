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

  if (assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/users`,
        name: assessmentType.name,
      },
    ]
    if (assessment) {
      return children
    }
    return <NotFound links={links} pageType="assessment" />
  }
}
