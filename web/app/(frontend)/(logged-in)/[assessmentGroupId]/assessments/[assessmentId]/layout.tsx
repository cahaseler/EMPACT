import React from "react"
import NotFound from "@/app/(frontend)/components/notFound"
import {
  fetchAssessment,
  fetchAssessmentType,
} from "../../../utils/dataFetchers"
import Stopwatch from "@/components/stopwatch/stopwatch"
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
        url: `/${assessmentType.id}/assessments`,
        name: assessmentType.name,
      },
    ]
    if (assessment) {
      // Wrap children and add Stopwatch. Stopwatch uses absolute positioning.
      return (
        <>
          {children}
          <Stopwatch />
        </>
      )
    }
    return <NotFound links={links} pageType="assessment" />
  }
}
