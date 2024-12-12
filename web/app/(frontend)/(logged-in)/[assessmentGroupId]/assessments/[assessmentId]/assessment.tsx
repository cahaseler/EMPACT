import { AssessmentType, Assessment, Part } from "@/prisma/mssql/generated/client"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import Link from "next/link"

export default function AssessmentContent({
  assessment, 
  assessmentType,
  parts
}: Readonly<{
  assessment: Assessment | null, 
  assessmentType: AssessmentType | null,
  parts: Part[]
}>) {
  if(assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`, 
        name: assessmentType.name
      },
    ]
    if(assessment) {
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
                <div>
                  <button className="w-fit bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded disabled:bg-indigo-700/70" disabled={assessment.status === "Completed"}>
                    Edit Assessment
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-16">
            <div className="w-full flex flex-col space-y-4">
              {parts.map((part: any, key: number) => {
                return (
                  <Link
                    key={key}
                    href={`/${assessmentType.id}/assessments/${assessment.id}/${part.name}`}
                    className="w-full flex h-20 items-center rounded-md px-8 bg-indigo-700/90 hover:bg-indigo-700/70 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    <div className="flex flex-col space-y-2 text-center">
                      <h2 className="text-xl font-bold text-indigo-50">
                        {part.name}
                      </h2>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      )
    }
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-8 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage="Assessment Not Found" />
            <p className="text-md text-muted-foreground dark:text-indigo-300/80">
              The assessment could not be found.
            </p>
          </div>
        </section>
      </div>
    )
  }
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-8 max-lg:ml-2">
          <p className="text-md text-muted-foreground dark:text-indigo-300/80">
            The assessment type could not be found.
          </p>
        </div>
      </section>
    </div>
  )
}