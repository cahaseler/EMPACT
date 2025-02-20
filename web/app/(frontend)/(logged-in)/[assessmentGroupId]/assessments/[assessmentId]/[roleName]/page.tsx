import { fetchAssessmentType, fetchAssessment } from "../../../../utils/dataFetchers"
import NotFound from "@/app/(frontend)/components/notFound"

export default async function Page({ params }: Readonly<{
params: { 
    assessmentGroupId: string,
    assessmentId: string,
    roleName: string
}
}>) {
    const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
    const assessment = await fetchAssessment(params.assessmentId)

    if (assessmentType && assessment) {
        const links = [
        {
            url: `/${assessmentType.id}/assessments`, 
            name: assessmentType.name
        },
        {
            url: `/${assessmentType.id}/assessments/${assessment.id}`, 
            name: assessment.name
            },
        ]
        return <NotFound links={links} pageType="part" />
    }
}