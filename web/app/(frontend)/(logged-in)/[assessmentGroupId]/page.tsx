import * as assessment from "@/app/utils/assessment"


async function fetchAssessments(assessmentCollectionId: string) {

  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentCollectionId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await assessment.findMany({ where: { assessmentCollectionId: idAsInteger } })
}

// TODO create a landing page for a collection of assessments, populate it with the list of assessments for the current collection
// If it's just a static page with links, we can build it here, or if we need something interactive we can write a client component and use that inside Page below.


export default async function Page({ params }: Readonly<{ params: { assessmentCollectionId: string } }>) {
  const assessments = await fetchAssessments(params.assessmentCollectionId)
  
  return <div >{assessments.map((assessment) => <div key={assessment.id}>{assessment.name}</div>)}</div>
}
