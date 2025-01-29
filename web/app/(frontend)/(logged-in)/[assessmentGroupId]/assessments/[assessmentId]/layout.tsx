import { 
  fetchAssessmentType, 
  fetchAssessment,
  fetchPartsSectionsAttributes 
} from "../../../utils/dataFetchers"

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
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const assessment = await fetchAssessment(params.assessmentId)
  const parts = await fetchPartsSectionsAttributes(params.assessmentGroupId)
  return (
    <SidebarProvider defaultOpen={false}>
        <AssessmentSidebar assessmentType={assessmentType} assessment={assessment} parts={parts} />
        {children}
    </SidebarProvider>
  )
}