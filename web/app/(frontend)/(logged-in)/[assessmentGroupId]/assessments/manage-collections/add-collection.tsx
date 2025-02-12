"use client"

import { useState } from "react"
import { Session } from "@/auth"
import { isCollectionManager } from "../../../utils/permissions"
import { createAssessmentCollection, createAssessmentCollectionUser } from "../../../utils/dataActions"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { AssessmentCollection } from "@/prisma/mssql/generated/client"

import { useRouter } from "next/navigation"

export default function AddCollection({
    assessmentTypeId,
    session
}: {
    assessmentTypeId: number,
    session: Session | null
}) {
    const [name, setName] = useState<string>("")
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        if (session) {
            e.preventDefault()
            setSaving(true)
            await createAssessmentCollection(name, assessmentTypeId).then(async (collection: AssessmentCollection) => {
                if (isCollectionManager(session)) {
                    await createAssessmentCollectionUser(parseInt(session.user.id, 10), collection.id).then(() => {
                        setName("")
                        setSaving(false)
                        router.refresh()
                    })
                } else {
                    setName("")
                    setSaving(false)
                    router.refresh()
                }
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <section className="mb-8 w-full">
                <div className="flex flex-row space-x-2 justify-end">
                    <Input 
                        type="text" 
                        placeholder="Collection Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="md:w-1/2 border-indigo-100 dark:border-indigo-900 focus-visible:outline-indigo-400 dark:focus-visible:ring-indigo-400 rounded-lg p-4 placeholder:text-indigo-900/50 dark:placeholder:text-indigo-400/40"
                    />
                    <Button 
                        type="submit" 
                        disabled={saving || name === ""} 
                        className="w-fit rounded-md bg-indigo-700/90 hover:bg-indigo-700/70 px-8 text-sm font-medium text-indigo-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        {saving && <Loader className="mr-2 h-4 w-4 animate-spin"/>} Add
                    </Button>
                </div>
            </section>
        </form>
    )
  }