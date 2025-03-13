import { fetchUsers } from "../../../utils/dataFetchers"
import { auth } from "@/auth"
import { isAdmin } from "../../../utils/permissions"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"

export default async function Page() {
  const session = await auth()

  const isUserAdmin = isAdmin(session)
  const users = await fetchUsers()

  if (isUserAdmin) {
    const links = [
      {
        url: "/admin",
        name: "Admin Settings",
      }
    ]
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage="Add Users" />
            <div className="flex flex-row justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">Add Users</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <div className="space-y-4">
            {/* TODO: Add user functionality */}
          </div>
        </section>
      </div>
    )
  }
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-8 max-lg:ml-2">
          <p className="text-md text-muted-foreground dark:text-indigo-300/80">
            You are not authorized to view this page.
          </p>
        </div>
      </section>
    </div>
  )
}