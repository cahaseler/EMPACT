import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible"
import { ChevronRight, CircleCheckBig } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
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

export function AssessmentSidebar({
  assessmentType,
  assessment,
  role,
  parts,
  assessmentUsers,
  userResponses,
  isParticipant
}: Readonly<{
  assessmentType: AssessmentType
  assessment: Assessment & { assessmentAttributes: AssessmentAttribute[] }
  role: string
  parts: (Part & { sections: (Section & { attributes: Attribute[] })[] })[]
  assessmentUsers: (AssessmentUser & { participantParts: AssessmentPart[] })[]
  userResponses: AssessmentUserResponse[]
  isParticipant: boolean
}>) {
  const responseAttributeIds = userResponses.map(
    (userResponse) => userResponse.attributeId
  )
  const assessmentAttributeIds = assessment.assessmentAttributes.map(
    (assessmentAttribute) => assessmentAttribute.attributeId
  )
  return (
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
          <SidebarTrigger className="hover:bg-transparent -ml-[3px]" />
        </div>
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:hidden">
        {parts.map((part) => {
          const partAttributeIds = part.sections.flatMap(
            section => section.attributes.map(
              attribute => attribute.id
            )
          )
          const partAttributesInAssessmentIds = partAttributeIds.filter(
            partAttributeId => assessmentAttributeIds.includes(partAttributeId)
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
          return (
            <Collapsible className="group/collapsible" key={part.id}>
              <SidebarGroup>
                <div className="flex flex-row justify-between items-center">
                  <SidebarGroupLabel asChild>
                    <a href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}`}>
                      {!unfinishedPart && <CircleCheckBig className="h-4 w-4 mr-2 opacity-50" />}
                      <span className={unfinishedPart ? "" : "opacity-50"}>
                        {part.name}
                      </span>
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
                        const sectionAttributesInAssessment = section.attributes.filter(
                          attribute => assessmentAttributeIds.includes(attribute.id)
                        )
                        const sectionAttributeIds = sectionAttributesInAssessment.map(
                          attribute => attribute.id
                        )
                        const sectionResponseAttributeIds = responseAttributeIds.filter(
                          responseAttributeId => sectionAttributeIds.includes(responseAttributeId)
                        )
                        const unfinishedSection =
                          sectionAttributeIds.length * numParticipants !== sectionResponseAttributeIds.length
                        if (sectionAttributesInAssessment.length > 0) {
                          return (
                            <Collapsible className="group/collapsible-2" key={section.id}>
                              <SidebarMenuItem key={section.name}>
                                <div className="flex flex-row justify-between items-center">
                                  <SidebarMenuButton asChild>
                                    <a href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}`}>
                                      {!unfinishedSection && <CircleCheckBig className="h-4 w-4 mr-2 opacity-50" />}
                                      <span className={unfinishedSection ? "" : "opacity-50"}>
                                        {section.id.toUpperCase()}. {section.name}
                                      </span>
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
                                    {sectionAttributesInAssessment.map((attribute) => {
                                      const attributeResponseAttributeIds = responseAttributeIds.filter(
                                        responseAttributeId => attribute.id === responseAttributeId
                                      )
                                      const unfinishedAttribute = attributeResponseAttributeIds.length !== numParticipants
                                      return (
                                        <SidebarMenuSubItem key={attribute.id}>
                                          <SidebarMenuButton asChild>
                                            <a href={`/${assessmentType.id}/assessments/${assessment.id}/${role}/${part.name}/${section.id}/${attribute.id}`}>
                                              {!unfinishedAttribute &&
                                                <CircleCheckBig className="h-4 w-4 mr-1 opacity-50" />
                                              }
                                              <span className={unfinishedAttribute ? "" : "opacity-50"}>
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
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
