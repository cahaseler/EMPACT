import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"

type link = {
    url: string,
    name: string
}

export default function NotFound({ 
    links,
    pageType,
 }: Readonly<{ 
    links?: link[],
    pageType: string
}>) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <section className="mb-8">
                <div className="space-y-8 max-lg:ml-2">
                    {links && <Breadcrumbs links={links} currentPage={pageType.toUpperCase() + " Not Found"} />}
                    <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                        The {pageType !== "assessment" && "assessment"} {pageType} could not be found.
                    </p>
                </div>
            </section>
        </div>
    )
}