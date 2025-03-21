import { fetchAssessmentType } from "../../utils/dataFetchers"

export default async function Page(
  props: Readonly<{ params: { assessmentGroupId: string } }>
) {
  const params = await props.params
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)

  if (assessmentType) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              {assessmentType.name} Resources
            </h1>
          </div>
        </section>
        <section className="mb-16">
          <div className="space-y-4">
            {/* TODO: Populate with resources */}
            <p>{assessmentType.name} resources</p>
          </div>
        </section>
      </div>
    )
  }
}
