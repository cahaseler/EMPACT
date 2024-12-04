import Link from "next/link"

export function Collections({ data }: Readonly<{data: any}>) {
  const assessmentCollections = data.assessmentCollections
  return (
    <div className="w-full max-w-4xl mx-auto">
    <section className="mb-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">EMPACT</h1>
            <h2 className="text-lg text-muted-foreground dark:text-indigo-300/80">
                Environment and Maturity Program Assessment and Control Tool
            </h2>
        </div>
    </section>
    <section className="mb-8">
            <p>
                EMPACT is an open-source implementation of the IP2M METRR Environmental and Maturity evaluation model, developed under sponsorship by the Department of Energy's Office of Project Management in collaboration with the Earned Value community. This project aims to provide a robust tool for assessing and controlling project management maturity and environmental factors. This project is based on the groundbreaking DOE-funded IP2M METRR research by Arizona State University, but is not affiliated or sponsored by ASU and is not based on ASU's proprietary IP2M METRR software.
            </p>
    </section>
    <section className="mb-16">
        <div className="space-y-4">
            {assessmentCollections.map((collection: any) => {
                return (
                    <Link
                        href={`/${collection.id}`}
                        className="flex h-40 items-center rounded-md bg-indigo-700/90 px-8 text-md font-medium text-indigo-50 shadow transition-colors hover:bg-indigo-700/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                    >
                        <div className="flex flex-col space-y-4">
                            <h1 className="text-2xl font-semibold leading-none tracking-tight">{collection.name}</h1>
                            <h2>{collection.description}</h2>
                        </div>
                    </Link>
                )
            })}
        </div>
    </section>
    </div>
  )
}
