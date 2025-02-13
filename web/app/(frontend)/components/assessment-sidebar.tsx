import { 
    AssessmentType, 
    Assessment,
    AssessmentUserResponse,
    Part, 
    Section, 
    Attribute 
} from "@/prisma/mssql/generated/client"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { ChevronRight, CircleCheckBig } from "lucide-react"

export function AssessmentSidebar ({ 
    assessmentType,
    assessment,
    parts,
    numAssessmentUsers,
    userResponses
}: Readonly<{ 
    assessmentType: AssessmentType | null
    assessment: Assessment | null 
    parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
    numAssessmentUsers: number
    userResponses: AssessmentUserResponse[]
}>) {
  const responseAttributeIds = userResponses.map(userResponse => userResponse.attributeId)
  return (
    <Sidebar 
        variant="floating" 
        className="h-3/4 group-data-[collapsible=icon]:h-fit mt-24 xl:mt-20 2xl:mt-14 xl:ml-2 2xl:ml-20 lg:group-data-[collapsible=icon]:ml-8 xl:group-data-[collapsible=icon]:ml-40 2xl:group-data-[collapsible=icon]:ml-60" 
        collapsible="icon"
    >
      <SidebarHeader>
        <div className="flex flex-row justify-between items-center p-2">
            <a 
            href={assessmentType && assessment ? `/${assessmentType.id}/assessments/${assessment.id}` : "/"}
            className="font-bold group-data-[collapsible=icon]:hidden text-indigo-900 dark:text-indigo-50"
            >
                <span>{assessment?.name}</span>
            </a>
            <SidebarTrigger className="hover:bg-transparent" />
        </div>
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:hidden">
        {parts.map((part) => {
            const partAttributeIds = part.sections.flatMap(section => section.attributes.map(attribute => attribute.id))
            const partResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => partAttributeIds.includes(responseAttributeId))
            const unfinishedPart = partAttributeIds.length * numAssessmentUsers !== partResponseAttributeIds.length * numAssessmentUsers
            return ( 
            <Collapsible className="group/collapsible">
                <SidebarGroup>
                    <div className="flex flex-row justify-between items-center">
                        <SidebarGroupLabel asChild>
                            <a href={assessmentType && assessment ? `/${assessmentType.id}/assessments/${assessment.id}/${part.name}` : "/"}>
                                {!unfinishedPart && <CircleCheckBig className="h-4 w-4 mr-2 opacity-50" />
                                }
                                <span className={unfinishedPart ? "" : "opacity-50"}>{part.name}</span>
                            </a>
                        </SidebarGroupLabel>
                        <div className="ml-1 cursor-pointer">
                            <CollapsibleTrigger asChild>
                                <ChevronRight className="h-4 w-4 shrink-0 text-indigo-900/70 dark:text-indigo-50/70 group-data-[state=open]/collapsible:rotate-90 transition duration-200" />
                            </CollapsibleTrigger>
                        </div>
                    </div>
                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {part.sections.map((section) => {
                                const sectionAttributeIds = section.attributes.map(attribute => attribute.id)
                                const sectionResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => sectionAttributeIds.includes(responseAttributeId))
                                const unfinishedSection = sectionAttributeIds.length * numAssessmentUsers !== sectionResponseAttributeIds.length * numAssessmentUsers
                                return (
                                <Collapsible className="group/collapsible-2">
                                    <SidebarMenuItem key={section.name}>
                                        <div className="flex flex-row justify-between items-center">
                                            <SidebarMenuButton asChild>
                                                <a href={assessmentType && assessment ? `/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}` : "/"}>
                                                    {!unfinishedSection && <CircleCheckBig className="h-4 w-4 mr-2 opacity-50" />
                                                    }
                                                    <span className={unfinishedSection ? "" : "opacity-50"}>{section.id.toUpperCase()}. {section.name}</span>
                                                </a>
                                            </SidebarMenuButton>
                                            <div className="ml-1 py-2 px-1 cursor-pointer rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-700 hover:text-sidebar-accent-foreground">
                                                <CollapsibleTrigger asChild>
                                                    <ChevronRight className="h-4 w-4 shrink-0 group-data-[state=open]/collapsible-2:rotate-90 transition duration-200" />
                                                </CollapsibleTrigger>
                                            </div>
                                        </div>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {section.attributes.map((attribute) => {
                                                    const attributeResponseAttributeIds = responseAttributeIds.filter(responseAttributeId => attribute.id === responseAttributeId)
                                                    const unfinishedAttribute = attributeResponseAttributeIds.length !== numAssessmentUsers
                                                    return (
                                                    <SidebarMenuSubItem key={attribute.name}>
                                                        <SidebarMenuButton asChild>
                                                            <a href={assessmentType && assessment ? `/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}/${attribute.id}` : "/"}>
                                                                {!unfinishedAttribute && <CircleCheckBig className="h-4 w-4 mr-1 opacity-50" />}
                                                                <span className={unfinishedAttribute ? "" : "opacity-50"}>{attribute.id.toUpperCase()}. {attribute.name}</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                )})}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            )})}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        )})}
      </SidebarContent>
    </Sidebar>
  )
}