import { fetchAssessmentType } from "../../../utils/dataFetchers"
import NotFound from "@/app/(frontend)/components/notFound"

export default async function Page(
    props: Readonly<{
    params: { 
        assessmentGroupId: string
    }
    }>
) {
    const params = await props.params;
    const assessmentType = await fetchAssessmentType(params.assessmentGroupId)

    if (assessmentType) {
        const links = [
            {
                url: `/${assessmentType.id}/users`, 
                name: assessmentType.name
            }
        ]
        return <NotFound links={links} pageType="assessment" />
    }
}