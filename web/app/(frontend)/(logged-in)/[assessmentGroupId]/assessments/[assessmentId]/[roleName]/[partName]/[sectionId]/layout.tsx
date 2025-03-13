import { 
    fetchAssessmentType, 
    fetchAssessment,
    fetchPart,
    fetchSection
  } from "../../../../../../utils/dataFetchers"
  import NotFound from "@/app/(frontend)/components/notFound"
  
  export default async function RootLayout({
    children,
    params
  }: Readonly<{
    children: React.ReactNode,
    params: { 
      assessmentGroupId: string,
      assessmentId: string,
      roleName: string,
      partName: string,
      sectionId: string
    }
  }>) {
    const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
    const assessment = await fetchAssessment(params.assessmentId)
    const part = await fetchPart(params.assessmentGroupId, params.partName)
    const section = await fetchSection(params.sectionId)
  
    if (assessmentType && assessment && part) {
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
      ]
      if (section) {
        return children
      }
      return <NotFound links={links} pageType="section" />
    }
    
  }