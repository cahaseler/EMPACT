import { 
    fetchAssessmentType,
    fetchAssessmentCollection,
    fetchUsers
} from "../../../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isAdmin } from "../../../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import DataTable from "./data-table"

export default async function Page(
    props: Readonly<{ params: { 
        assessmentGroupId: string,
        collectionId: string 
    } }>
) {
    const params = await props.params;
    const session = await auth()

    const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
    const collection =  await fetchAssessmentCollection(params.collectionId)
    const users = await fetchUsers()

    if (assessmentType && collection) {
      const links = [
        {
          url: `/${assessmentType.id}/users`, 
          name: `${assessmentType.name} Users`
        },
        {
          url: `/${assessmentType.id}/users/collection/${collection.id}`, 
          name: `${collection.name} Managers`
        },
      ]
      if (isAdmin(session)) {
          const usersNotInCollection = users.filter(user => user.assessmentCollectionUser.find(uc => uc.assessmentCollectionId === collection.id) === undefined)
          return (
              <div className="w-full max-w-4xl mx-auto">
                  <section className="mb-8">
                      <div className="space-y-4">
                          <Breadcrumbs links={links} currentPage="Add Collection Managers" />
                          <div className="flex flex-row justify-between">
                              <h1 className="text-3xl font-bold tracking-tighter">Add Managers to {collection.name}</h1>
                          </div>
                      </div>
                  </section>
                  <section className="mb-8">
                      <DataTable 
                          users={usersNotInCollection} 
                          collectionId={collection.id}
                      />
                  </section>
              </div>
          )
      }
      return (
          <div className="w-full max-w-4xl mx-auto">
              <section className="mb-8">
                  <div className="space-y-4 max-lg:ml-2">
                      <Breadcrumbs links={links} currentPage="Add Collection Managers" />
                      <p className="text-md text-muted-foreground dark:text-indigo-300/80">
                          You are not authorized to view this page.
                      </p>
                  </div>
              </section>
          </div>
      )
    }
}