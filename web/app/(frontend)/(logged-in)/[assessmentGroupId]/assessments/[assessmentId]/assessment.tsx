import { AssessmentType, Assessment, Part } from "@/prisma/mssql/generated/client"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"
import Link from "next/link"

export default function AssessmentContent({
  assessment, 
  assessmentType,
  parts,
  canEdit
}: Readonly<{
  assessment: Assessment | null, 
  assessmentType: AssessmentType | null,
  parts: Part[],
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
                    className="inline-flex items-center justify-center rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 py-3 text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Edit Assessment
                  </Link>
                </div>}
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
    return <NotFound links={links} pageType="assessment" />
  }
  return <NotFound pageType="type" />
}