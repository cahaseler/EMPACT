import { fetchAssessmentType, fetchAssessmentCollection } from "../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isAdmin } from "../../../../utils/permissions"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import DataTable from "./data-table"

export default async function Page({ params }: Readonly<{ params: { assessmentGroupId: string, collectionId: string } }>) {
    const session = await auth()

    const collection = await fetchAssessmentCollection(params.collectionId)
    const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  
    if(assessmentType && collection) {
        const links = [
            {
                url: `/${assessmentType.id}/users`, 
                name: `${assessmentType.name} Users`
            },
        ]
        if (isAdmin(session)) {
            return (
                <div className="w-full max-w-4xl mx-auto">
                    <section className="mb-8">
                        <div className="space-y-4 max-lg:ml-2">
                            <Breadcrumbs links={links} currentPage={`${collection.name} Managers`} />
                            <div className="flex flex-col max-md:space-y-2 md:flex-row justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter">{collection.name} Managers</h1>
                                </div>
                                <div className="flex flex-row space-x-2 justify-end">
                                    <Link href={`/${assessmentType.id}/users/collection/${collection.id}/add-collection-managers`} prefetch={false} >
                                        <Button>
                                            Add Collection Managers
                                        </Button>
                                    </Link> 
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="mb-16">
                        <div className="space-y-4">
                            <DataTable users={collection.assessmentCollectionUser} />
                        </div>
                    </section>
                </div>
            )
        }
        return (
            <div className="w-full max-w-4xl mx-auto">
                <section className="mb-8">
                    <div className="space-y-4 max-lg:ml-2">
                        <Breadcrumbs links={links} currentPage={`${collection.name} Managers`} />
                        <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                            You are not authorized to view this page.
                        </p>
                    </div>
                </section>
            </div>
        )
    }
  }