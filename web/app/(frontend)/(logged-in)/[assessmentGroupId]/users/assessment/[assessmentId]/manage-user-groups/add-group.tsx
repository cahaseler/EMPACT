"use client"

import { useState } from "react"
import { createAssessmentUserGroup } from "../../../../../utils/dataActions"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function AddGroup({ assessmentId }: {
    assessmentId: number
}) {
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [status, setStatus] = useState<string>("Inactive")
    const [saving, setSaving] = useState<boolean>(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        await createAssessmentUserGroup(name, status, assessmentId).then(() => {
            setName("")
            setSaving(false)
            router.refresh()
            toast({
                title: "Assessment user group added successfully."
            })
        })
    }

    return (
        
            <div className="flex flex-col space-y-4 items-end">
                {!isAdding ? 
                    <Button 
                        onClick={() => setIsAdding(true)} 
                        variant="default" 
                        size="default"
                    >
                    Add User Group
                    </Button>
                : 
                    <Button 
                        onClick={() => setIsAdding(false)} 
                        variant="outline" 
                        size="default"
                    >
                    Cancel
                    </Button>
                }
                {isAdding && 
                    <form onSubmit={handleSubmit}>
                        <section className="w-full">
                            <div className="flex flex-row space-x-2 justify-end">
                                <Input 
                                    type="text" 
                                    placeholder="Group Name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                                <Select 
                                    onValueChange={(value) => setStatus(value)}
                                >
                                    <SelectTrigger className="focus:ring-offset-indigo-400 focus:ring-transparent">
                                        <SelectValue placeholder={status} defaultValue={status}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active" key={0}>
                                            Active
                                        </SelectItem>
                                        <SelectItem value="Inactive" key={1}>
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" disabled={saving || name === ""}>
                                    {saving && <Loader className="mr-2 h-4 w-4 animate-spin"/>} Add
                                </Button>
                            </div>
                        </section>
                    </form>
                }
            </div>
        
    )
  }