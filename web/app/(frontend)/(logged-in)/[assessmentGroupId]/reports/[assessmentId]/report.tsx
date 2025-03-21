import { Assessment } from "@/prisma/mssql/generated/client"

export default function AssessmentReport({
  assessment,
}: Readonly<{
  assessment: Assessment
}>) {
  return (
    <div className="w-full flex flex-col space-y-4">
      {/* TODO: Populate with report data */}
      <p>{assessment.name} report content</p>
    </div>
  )
}
