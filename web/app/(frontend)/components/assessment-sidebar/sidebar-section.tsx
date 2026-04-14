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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

import { Attribute, Section } from "@/prisma/mssql/generated/client"

export default function SidebarSection({
  urlHead,
  section,
  assessmentAttributeIds,
  responseAttributeIds,
  numParticipants,
  sidebarPinnedOpen
}: Readonly<{
  urlHead: string
  section: Section & { attributes: Attribute[] }
  assessmentAttributeIds: string[]
  responseAttributeIds: string[]
  numParticipants: number
  sidebarPinnedOpen: boolean
}>) {
  const sectionAttributesInAssessment = section.attributes.filter(
    attribute => assessmentAttributeIds.includes(attribute.id)
  )
  const sortedSectionAttributes = sectionAttributesInAssessment.sort((a, b) => {
    const aId = a.id.replace(".", "");
    const bId = b.id.replace(".", "");

    const regex = /(\d+)|(\D+)/g;
    const aParts = aId.match(regex);
    const bParts = bId.match(regex);

    if (aParts && bParts) {
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || "";
        const bPart = bParts[i] || "";

        if (/\d/.test(aPart) && /\d/.test(bPart)) {
          const aNum = parseInt(aPart, 10);
          const bNum = parseInt(bPart, 10);
          if (aNum !== bNum) {
            return aNum - bNum;
          }
        } else if (aPart !== bPart) {
          return aPart.localeCompare(bPart);
        }
      }
    }
    return 0;
  });

  const sectionAttributeIds = sectionAttributesInAssessment.map(
    attribute => attribute.id
  )

  const sectionResponseAttributeIds = responseAttributeIds.filter(
    responseAttributeId => sectionAttributeIds.includes(responseAttributeId)
  )

  const unfinishedSection =
    sectionAttributeIds.length * numParticipants !== sectionResponseAttributeIds.length

  const pn = usePathname()
  const sectionPn = `/${urlHead}/${section.id}`

  const [sectionPinnedOpen, setSectionPinnedOpen] = useState(
    typeof window !== "undefined" && localStorage.getItem(`section${section.id}PinnedOpen`) === "true"
  )
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sidebarPinnedOpen) {
        localStorage.setItem(`section${section.id}PinnedOpen`, JSON.stringify(sectionPinnedOpen))
      } else {
        localStorage.clear()
        setSectionPinnedOpen(false)
      }
    }
  }, [sidebarPinnedOpen, sectionPinnedOpen]);

  if (sectionAttributesInAssessment.length > 0) {
    return (
      <Collapsible className="group/collapsible-2" key={section.id} defaultOpen={sectionPinnedOpen}>
        <SidebarMenuItem key={section.name}>
          <div className="flex flex-row justify-between items-center">
            <SidebarMenuButton asChild>
              <a href={`/${urlHead}/${section.id}`}>
                {!unfinishedSection && <CircleCheckBig className="h-4 w-4 mr-2 opacity-50" />}
                <span className={(pn.includes(sectionPn) && "font-bold") + (unfinishedSection ? "" : " opacity-50")}>
                  {section.id.toUpperCase()}. {section.name}
                </span>
              </a>
            </SidebarMenuButton>
            <div className="ml-1 py-2 px-1 cursor-pointer rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-700 hover:text-sidebar-accent-foreground">
              <CollapsibleTrigger asChild>
                <ChevronRight
                  className="h-4 w-4 shrink-0 group-data-[state=open]/collapsible-2:rotate-90 transition duration-200"
                  onClick={() => sidebarPinnedOpen && setSectionPinnedOpen(!sectionPinnedOpen)}
                />
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent>
            <SidebarMenuSub>
              {sortedSectionAttributes.map((attribute) => {
                const attributeResponseAttributeIds = responseAttributeIds.filter(
                  responseAttributeId => attribute.id === responseAttributeId
                )
                const unfinishedAttribute = attributeResponseAttributeIds.length !== numParticipants
                const urlAttributeId = attribute.id.replace(".", "")
                const attributePn = `/${urlHead}/${section.id}/${urlAttributeId}`
                return (
                  <SidebarMenuSubItem key={attribute.id}>
                    <SidebarMenuButton asChild>
                      <a href={attributePn}>
                        {!unfinishedAttribute &&
                          <CircleCheckBig className="h-4 w-4 mr-1 opacity-50" />
                        }
                        <span className={(attributePn === pn && "font-bold") + (unfinishedAttribute ? "" : " opacity-50")}>
                          {attribute.id.toUpperCase()}. {attribute.name}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }
}
