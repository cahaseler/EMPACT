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

export default function AssessmentContent({
  assessment, 
  assessmentType,
  parts,
  numAssessmentUsers,
  userResponses,
  canEdit
}: Readonly<{
  assessment: Assessment | null, 
  assessmentType: AssessmentType | null,
  parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[],
  numAssessmentUsers: number,
  userResponses: AssessmentUserResponse[],
  canEdit: boolean
}>) {
  if(assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`, 
        name: assessmentType.name
      },
    ]
    if(assessment) {
      const responseAttributeIds = userResponses.map(userResponse => userResponse.attributeId)
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={assessment.name} />
              <div className="flex flex-row justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter">{assessment.name}</h1>
                  <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                    {assessment.description}
                  </p>
                </div>
                {/* TODO: Edit assessment functionality */}
                {canEdit && <div>
                  <Link
                    href={`/${assessmentType.id}/assessments/${assessment.id}/edit-assessment`}
                    prefetch={false}
                  >
                    <Button>
                      Edit Assessment
                    </Button>
                  </Link>
                </div>}
              </div>
            </div>
          </section>
          <section className="mb-16">
            <div className="w-full flex flex-col space-y-4">
              {parts.map((part: Part & { sections: (Section & { attributes: Attribute[] })[] }, key: number) => {
                const partAttributeIds = part.sections.flatMap(section => section.attributes.map(attribute => attribute.id))
                const partResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => partAttributeIds.includes(responseAttributeId))
                const unfinishedPart = partAttributeIds.length * numAssessmentUsers !== partResponseAttributeIds.length * numAssessmentUsers
                return (
                  <Link
                    key={key}
                    href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}`}
                    prefetch={false}
                  >
                    <Button size="xl">
                      <div className="flex flex-col w-full space-y-2">
                        <h2 className="text-xl font-bold text-indigo-50">
                          {part.name}
                        </h2>
                        <h3 className="text-lg font-semibold text-indigo-200">
                          Status: {unfinishedPart ? "In Progress" : "Completed"}
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
    return <NotFound links={links} pageType="assessment" />
  }
  return <NotFound pageType="type" />
}