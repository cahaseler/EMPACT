"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { Pin, PinOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TooltipButton } from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

import {
  Assessment,
  AssessmentAttribute,
  AssessmentPart,
  AssessmentType,
  AssessmentUser,
  AssessmentUserResponse,
  Attribute,
  Part,
  Section
} from "@/prisma/mssql/generated/client"

import SidebarPart from "./sidebar-part"

export function AssessmentSidebar({
  children,
  assessmentType,
  assessment,
  role,
  parts,
  assessmentUsers,
  userResponses,
  isParticipant,
}: Readonly<{
  children: React.ReactNode
  assessmentType: AssessmentType
  assessment: Assessment & {
    assessmentParts: AssessmentPart[],
    assessmentAttributes: AssessmentAttribute[]
  }
  role: string
  parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
  assessmentUsers: (AssessmentUser & { participantParts: AssessmentPart[] })[]
  userResponses: AssessmentUserResponse[]
  isParticipant: boolean
}>) {
  const assessmentAttributeIds = assessment.assessmentAttributes.map(
    (assessmentAttribute) => assessmentAttribute.attributeId
  )

  const [sidebarPinnedOpen, setSidebarPinnedOpen] = useState(
    typeof window !== "undefined" && localStorage.getItem("sidebarPinnedOpen") === "true"
  )
  useEffect(() => {
    localStorage.setItem("sidebarPinnedOpen", JSON.stringify(sidebarPinnedOpen));
  }, [sidebarPinnedOpen]);

  return (
    <SidebarProvider defaultOpen={sidebarPinnedOpen}>
      <Sidebar
        variant="floating"
        className="h-3/4 group-data-[collapsible=icon]:h-fit mt-24 xl:mt-20 2xl:mt-14 xl:ml-2 2xl:ml-20 lg:group-data-[collapsible=icon]:ml-8 xl:group-data-[collapsible=icon]:ml-40 2xl:group-data-[collapsible=icon]:ml-60"
        collapsible="icon"
      >
        <SidebarHeader>
          <div className="flex flex-row justify-between p-2">
            <div className="group-data-[collapsible=icon]:hidden flex flex-col space-y-2">
              <a
                href={`/${assessmentType.id}/assessments/${assessment.id}`}
                className="font-bold text-indigo-900 dark:text-indigo-50"
              >
                {assessment.name}
              </a>
              <span className="text-[15px] font-semibold text-indigo-900/80 dark:text-indigo-50/80">
                {role}
              </span>
            </div>
            <div className="flex flex-row">
              <TooltipButton content={sidebarPinnedOpen ? "Unpin Sidebar" : "Pin Sidebar"}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="group-data-[collapsible=icon]:hidden hover:bg-transparent mr-2"
                  onClick={() => setSidebarPinnedOpen(!sidebarPinnedOpen)}
                >
                  {sidebarPinnedOpen ?
                    <PinOff className="w-5 h-5 text-indigo-900 dark:text-white" /> :
                    <Pin className="w-5 h-5 text-indigo-900 dark:text-white" />
                  }
                </Button>
              </TooltipButton>
              <SidebarTrigger className="hover:bg-transparent -ml-[3px]" />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="group-data-[collapsible=icon]:hidden">
          {parts.map((part) => {
            const assessmentPart = assessment.assessmentParts.find(
              (assessmentPart) => assessmentPart.partId === part.id
            )
            return (
              <SidebarPart
                key={part.id}
                urlHead={`/${assessmentType.id}/assessments/${assessment.id}/${role}`}
                assessmentPart={assessmentPart}
                part={part}
                assessmentAttributeIds={assessmentAttributeIds}
                assessmentUsers={assessmentUsers}
                userResponses={userResponses}
                isParticipant={isParticipant}
                sidebarPinnedOpen={sidebarPinnedOpen}
              />
            )
          })}
        </SidebarContent>
      </Sidebar>
      {children}
    </SidebarProvider>
  )
}
