import { AssessmentType, Assessment } from "@/prisma/mssql/generated/client"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"

export default function AssessmentReport({
  assessment, 
  assessmentType,
}: Readonly<{
  assessment: Assessment | null, 
  assessmentType: AssessmentType | null,
}>) {
  if(assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/reports`, 
        name: `${assessmentType.name} Reports`
      },
    ]
    if(assessment) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="space-y-4 max-lg:ml-2">
              <Breadcrumbs links={links} currentPage={`${assessment.name} Report`} />
              <div className="flex flex-row justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter">{assessment.name} Report</h1>
                  <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                    {assessment.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-16">
            <div className="w-full flex flex-col space-y-4">
              {/* TODO: Populate with report data */}
              <p>Report content</p>
            </div>
          </section>
        </div>
      )
    }
    return <NotFound links={links} pageType="assessment" />
  }
  return <NotFound pageType="type" />
}