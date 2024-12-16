import { AssessmentType, Assessment, Part, Section } from "@/prisma/mssql/generated/client"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"
import Link from "next/link"

export default function PartContent({
    assessment, 
    assessmentType,
    part,
    sections
}: {
    assessment: Assessment | null, 
    assessmentType: AssessmentType | null,
    part: Part | null,
    sections: Section[]
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
        return (
          <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
              <div className="space-y-4 max-lg:ml-2">
                <Breadcrumbs links={links} currentPage={part.name} />
                <div className="flex flex-row justify-between">
                  <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter">{part.name} Assessment</h1>
                      <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                        {part.description}
                      </p>
                  </div>
                  {/* TODO: Submit assessment functionality */}
                  <div>
                    <button className="w-fit bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded disabled:bg-indigo-700/70" disabled={assessment.status === "Completed"}>
                      Submit Assessment
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <section className="mb-16">
                <div className="flex flex-col space-y-2">
                  {sections.map((section: Section, key: number) => {
                    return(
                      <Link
                        key={key}
                        href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}`}
                        className="flex min-h-20 items-center rounded-md px-8 py-3 bg-indigo-700/90 hover:bg-indigo-700/70 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        <h2 className="text-xl font-bold text-indigo-50">
                            {section.id.toString().toUpperCase()}. {section.name}
                        </h2>
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