"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createUsers } from "./actions"

export function AddUsersDialog() {
  const [open, setOpen] = useState(false)
  const [emails, setEmails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle creating users
  const handleCreateUsers = async () => {
    if (!emails.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one email address",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await createUsers({ emails })

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setOpen(false)
        setEmails("")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">Add Users</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Users</DialogTitle>
          <DialogDescription className="whitespace-pre-wrap">
            Enter email addresses separated by commas or new lines to add
            multiple users at once. Note: You do not have to add users on this
            page, and adding users on this page does not send invites. Use the
            Clerk Account Portal to send invites, and users will be added to
            this list when they log in. If you want to pre-assign admin
            permissions to users before they have logged in, you can add them
            here.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="user1@example.com, user2@example.com"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateUsers} disabled={isSubmitting}>
            {isSubmitting ? "Adding Users..." : "Add Users"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
