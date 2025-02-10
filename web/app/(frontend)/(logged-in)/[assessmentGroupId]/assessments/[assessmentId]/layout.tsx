import { 
  fetchAssessmentType, 
  fetchAssessment,
  fetchPartsSectionsAttributes,
  fetchAssessmentParticipants
} from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isParticipantForAssessment, viewableResponses } from "../../../utils/permissions"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AssessmentSidebar } from "@/app/(frontend)/components/assessment-sidebar"

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: { 
    assessmentGroupId: string,
    assessmentId: string
  }
}>) {
  const session = await auth()

  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const parts = await fetchPartsSectionsAttributes(params.assessmentGroupId)
  const assessmentParticipants = await fetchAssessmentParticipants(params.assessmentId)

  const isParticipant = isParticipantForAssessment(session, params.assessmentId)
  const numAssessmentUsers = isParticipant ? 1 : assessmentParticipants.length
  const userResponses = await viewableResponses(session, params.assessmentId)

  return (
    <SidebarProvider defaultOpen={false}>
        <AssessmentSidebar 
          assessmentType={assessmentType} 
          assessment={assessment} 
          parts={parts} 
          numAssessmentUsers={numAssessmentUsers}
          userResponses={userResponses} 
        />
        {children}
    </SidebarProvider>
  )
}