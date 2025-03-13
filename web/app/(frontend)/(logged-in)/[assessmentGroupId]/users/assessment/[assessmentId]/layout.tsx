import { fetchAssessmentType, fetchAssessment } from "../../../../utils/dataFetchers"
import NotFound from "@/app/(frontend)/components/notFound"

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode,
    params: { 
        assessmentGroupId: string,
        assessmentId: string}
}>) {
    const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
    const assessment = await fetchAssessment(params.assessmentId)

    if (assessmentType) {
        const links = [
            {
                url: `/${assessmentType.id}/users`, 
                name: assessmentType.name
            },
        ]
        if (assessment) {
            return children
        }
        return <NotFound links={links} pageType="assessment" />
    }
}