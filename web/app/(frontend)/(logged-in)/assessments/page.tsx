import { dummyData } from "@/app/utils/dummyData"

import Link from "next/link"

async function fetchPageData() {
  // TODO: Replace with actual data based on user role/permissions
  return dummyData()
}

export default async function Page() {

  const data = await fetchPageData()
  const assessmentCollections = data.assessmentCollections
  return (
    <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
      <div className="w-full max-w-6xl mx-auto">
        <section className="mb-8 ml-2">
            <h1 className="text-3xl font-bold tracking-tighter">Assessment Collections</h1>
        </section>
        <section className="mb-16">
            <div className="space-y-4">
                {assessmentCollections.map((collection: any) => {
                    return (
                        <Link
                            href={`/${collection.id}`}
                            className="flex h-20 items-center justify-center rounded-md bg-indigo-700/90 px-8 text-md font-medium text-indigo-50 shadow transition-colors hover:bg-indigo-700/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}
                        >
                            {collection.name}
                        </Link>
                    )
                })}
            </div>
        </section>
      </div>
    </div>
  )
}
