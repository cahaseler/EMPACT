import { fetchAssessmentType } from "../../../utils/dataFetchers"
import NotFound from "@/app/(frontend)/components/notFound"

export default async function Page({ params }: Readonly<{
params: { 
    assessmentGroupId: string
}
}>) {
    const assessmentType = await fetchAssessmentType(params.assessmentGroupId)

    if (assessmentType) {
        const links = [
            {
                url: `/${assessmentType.id}/users`, 
                name: assessmentType.name
            }
        ]
        return <NotFound links={links} pageType="collection" />
    }
}