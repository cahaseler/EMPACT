"use client"
import { useSession } from "@clerk/nextjs"
import React from "react"

export function MultisessionAppSupport({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()

  return (
    <React.Fragment key={session ? session.id : "no-users"}>
      {children}
    </React.Fragment>
  )
}
