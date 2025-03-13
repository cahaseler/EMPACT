import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()

  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-8">
        <div className="space-y-4 max-lg:ml-2">
          <div className="flex flex-row justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">{session?.user?.name} Settings</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-16">
        <div className="space-y-4">
          {/* TODO: Populate with settings */}
        </div>
      </section>
    </div>
  )
}