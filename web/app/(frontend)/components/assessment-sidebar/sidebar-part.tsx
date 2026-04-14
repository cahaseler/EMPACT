"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible"
import { ChevronRight, CircleCheckBig } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar"

import {
  AssessmentPart,
  AssessmentUser,
  AssessmentUserResponse,
  Attribute,
  Part,
  Section
} from "@/prisma/mssql/generated/client"

import SidebarSection from "./sidebar-section"

export default function SidebarPart({
  urlHead,
  assessmentPart,
  part,
  assessmentAttributeIds,
  assessmentUsers,
  userResponses,
  isParticipant,
  sidebarPinnedOpen
}: Readonly<{
  urlHead: string
  assessmentPart: AssessmentPart | undefined
  part: Part & { sections: (Section & { attributes: Attribute[] })[] }
  assessmentAttributeIds: string[]
  assessmentUsers: (AssessmentUser & { participantParts: AssessmentPart[] })[]
  userResponses: AssessmentUserResponse[]
  isParticipant: boolean
  sidebarPinnedOpen: boolean
}>) {
  const partAttributeIds = part.sections.flatMap(
    section => section.attributes.map(
      attribute => attribute.id
    )
  )
  const partAttributesInAssessmentIds = partAttributeIds.filter(
    partAttributeId => assessmentAttributeIds.includes(partAttributeId)
  )

  const responseAttributeIds = userResponses.map(
    (userResponse) => userResponse.attributeId
  )
  const partResponseAttributeIds = responseAttributeIds.filter(
    responseAttributeId => partAttributesInAssessmentIds.includes(responseAttributeId)
  )

  const partParticipants = assessmentUsers.filter(
    assessmentUser =>
      assessmentUser.role === "Participant" ||
      assessmentUser.participantParts.some(
        participantPart => participantPart.partId === part.id
      )
  )

  const numParticipants = isParticipant ? 1 : partParticipants.length
  const unfinishedPart =
    partAttributesInAssessmentIds.length * numParticipants !== partResponseAttributeIds.length

  const [partPinnedOpen, setPartPinnedOpen] = useState(
    typeof window !== "undefined" && localStorage.getItem(`part${part.name}PinnedOpen`) === "true"
  )
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sidebarPinnedOpen) {
        localStorage.setItem(`part${part.name}PinnedOpen`, JSON.stringify(partPinnedOpen))
      } else {
        localStorage.clear()
        setPartPinnedOpen(false)
      }
    }
  }, [sidebarPinnedOpen, partPinnedOpen]);

  if (assessmentPart) {
    return (
      <Collapsible className="group/collapsible" key={part.id} defaultOpen={partPinnedOpen}>
        <SidebarGroup>
          <div className="flex flex-row justify-between items-center">
            <SidebarGroupLabel asChild>
              <a href={`/${urlHead}/${part.name}`}>
                {!unfinishedPart && <CircleCheckBig className="h-4 w-4 mr-2 opacity-50" />}
                <span className={unfinishedPart ? "" : "opacity-50"}>
                  {part.name}
                </span>
              </a>
            </SidebarGroupLabel>
            <div className="ml-1 cursor-pointer">
              <CollapsibleTrigger asChild>
                <ChevronRight
                  className="h-4 w-4 shrink-0 group-data-[state=open]/collapsible:rotate-90 transition duration-200"
                  onClick={() => sidebarPinnedOpen && setPartPinnedOpen(!partPinnedOpen)}
                />
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {part.sections.map((section) =>
                  <SidebarSection
                    key={section.id}
                    urlHead={`/${urlHead}/${part.name}`}
                    section={section}
                    assessmentAttributeIds={assessmentAttributeIds}
                    responseAttributeIds={partResponseAttributeIds}
                    numParticipants={numParticipants}
                    sidebarPinnedOpen={sidebarPinnedOpen}
                  />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    )
  }

}
