import { 
  AssessmentType, 
  Assessment, 
  AssessmentUserResponse, 
  Part, 
  Section, 
  Attribute 
} from "@/prisma/mssql/generated/client"
import { Button } from "@/components/ui/button"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"
import Link from "next/link"

export default function PartContent({
    assessment, 
    assessmentType,
    part,
    numAssessmentUsers,
    userResponses
}: {
    assessment: Assessment | null, 
    assessmentType: AssessmentType | null,
    part: Part & { sections: (Section & { attributes: Attribute[] })[] } | null,
    numAssessmentUsers: number,
    userResponses: AssessmentUserResponse[]
}) {
  if(assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`, 
        name: assessmentType.name
      }
    ]
    if(assessment) {
      links.push({
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name
      });
      if (part) {
        const responseAttributeIds = userResponses.map(userResponse => userResponse.attributeId)
        return (
          <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
              <div className="space-y-4 max-lg:ml-2">
                <Breadcrumbs links={links} currentPage={part.name} />
                <div className="flex flex-row justify-between">
                  <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter">{part.name}</h1>
                      <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                        {part.description}
                      </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="mb-16">
                <div className="flex flex-col space-y-2">
                  {part.sections.map((section: Section & { attributes: Attribute[] }, key: number) => {
                    const sectionAttributeIds = section.attributes.map(attribute => attribute.id)
                    const sectionResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => sectionAttributeIds.includes(responseAttributeId))
                    const unfinishedSection = sectionAttributeIds.length * numAssessmentUsers !== sectionResponseAttributeIds.length * numAssessmentUsers
                    return (
                      <Link
                        key={key}
                        href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}`}
                        prefetch={false}
                      >
                        <Button size="xl">
                          <div className="w-full flex flex-col space-y-2">
                            <h2 className="text-xl font-bold text-indigo-50">
                                {section.id.toString().toUpperCase()}. {section.name}
                            </h2>
                            <h3 className="text-lg font-semibold text-indigo-200">
                              Status: {unfinishedSection ? "In Progress" : "Completed"}
                            </h3>
                          </div>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
            </section>
          </div>
        )
      }
      return <NotFound links={links} pageType="part" />
    }
    return <NotFound links={links} pageType="assessment" />
  }
  return <NotFound pageType="type" />
}