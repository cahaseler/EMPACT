import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"

import { auth } from "@/auth"

import { Card } from "@/components/ui/card"

import {
  fetchAssessment,
  fetchAssessmentAttribute,
  fetchAssessmentType,
  fetchAssessmentUsers,
  fetchAssessmentUserGroups,
  fetchLevels,
  fetchNextAttribute,
  fetchPart,
  fetchPreviousAttribute,
  fetchSection
} from "../../../../../../../utils/dataFetchers"
import { viewableAttributeResponses, viewableResponses } from "../../../../../../../utils/permissions"

import AttributeLevels from "./attributeLevels"
import AttributeResponseTable from "./attributeResponseTable"
import AttributeUserResponse from "./attributeUserResponse"
import Navigation from "./navigation"

export default async function Page(
  props: Readonly<{
    params: {
      assessmentGroupId: string
      assessmentId: string
      roleName: string
      partName: string
      sectionId: string
      attributeId: string
    }
  }>
) {
  const params = await props.params
  const session = await auth()

  const assessment = await fetchAssessment(params.assessmentId)
  const assessmentAttribute = await fetchAssessmentAttribute(params.assessmentId, params.attributeId)
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  const part = await fetchPart(params.assessmentGroupId, params.partName)
  const section = await fetchSection(params.sectionId)
  const prevAttribute = await fetchPreviousAttribute(
    params.assessmentId,
    params.partName,
    params.attributeId
  )
  const nextAttribute = await fetchNextAttribute(
    params.assessmentId,
    params.partName,
    params.attributeId
  )
  const levels = await fetchLevels(params.attributeId)

  const assessmentUsers = await fetchAssessmentUsers(params.assessmentId)
  const groups = await fetchAssessmentUserGroups(params.assessmentId)
  const isParticipant = params.roleName === "Participant"
  const allResponses = await viewableResponses(
    session,
    params.assessmentId,
    params.roleName
  )
  const userResponses = await viewableAttributeResponses(
    session,
    params.assessmentId,
    params.attributeId,
    params.roleName
  )

  if (assessmentType && assessment && part && section && assessmentAttribute && assessmentUsers) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: `${assessmentType.name} Assessments`,
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name,
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}/${params.roleName}/${part.name}`,
        name: `${part.name} Assessment`,
      },
      {
        url: `/${assessmentType.id}/assessments/${assessment.id}/${params.roleName}/${part.name}/${section.id}`,
        name: `${section.id.toString().toUpperCase()}. ${section.name}`,
      },
    ]

    const activeGroups = groups.filter(group => group.status === "Active")
    const activeGroupsUserResponses = activeGroups.flatMap(
      group => group.assessmentUser
    ).flatMap(
      user => user.user.assessmentUserResponse
    ).filter(
      response => response.attributeId ===
        params.attributeId &&
        response.assessmentId === assessment.id
    )
    const partParticipants = assessmentUsers.filter(
      assessmentUser =>
        assessmentUser.role === "Participant" ||
        assessmentUser.participantParts.some(
          participantPart => participantPart.partId === part.id
        )
    )
    const numParticipants =
      activeGroups.length > 0 ?
        activeGroups.flatMap(group => group.assessmentUser).length :
        partParticipants.length

    const attributeIdDisplay =
      part.attributeType === "Attribute" ?
        assessmentAttribute.attributeId.toUpperCase() :
        assessmentAttribute.attributeId

    const partAttributeIds = part.sections.flatMap(
      section => section.attributes.map(
        attribute => attribute.id
      )
    )
    const responsesInPart = allResponses.filter(
      response => partAttributeIds.includes(response.attributeId)
    )
    const assessmentAttributesInPart = assessment.assessmentAttributes.filter(
      assessmentAttribute => partAttributeIds.includes(assessmentAttribute.attributeId)
    )
    const hasUserSubmittedAllResponses = responsesInPart.length === assessmentAttributesInPart.length
    return (
      <div className="w-full max-w-4xl mx-auto">
        <section className="mb-8">
          <div className="space-y-4 max-lg:ml-2">
            <Breadcrumbs links={links} currentPage={part.attributeType + " " + attributeIdDisplay} />
            <div className={isParticipant ? "space-y-4" : "space-y-6"}>
              <h1
                className="text-3xl font-bold tracking-tighter"
                dangerouslySetInnerHTML={{
                  __html: attributeIdDisplay + ". " + assessmentAttribute.attribute.name
                }}
              />
              {params.roleName === "Facilitator" &&
                <AttributeResponseTable
                  assessmentStatus={assessment.status}
                  userResponses={activeGroups.length > 0 ? activeGroupsUserResponses : userResponses}
                  levels={levels}
                  numParticipants={numParticipants}
                />
              }
              <Card className="bg-white max-h-60 overflow-auto px-6 py-1">
                <div
                  className="text-sm text-description text-muted-foreground dark:text-indigo-300/80"
                  dangerouslySetInnerHTML={{ __html: assessmentAttribute.attribute.description }}
                />
              </Card>
            </div>
          </div >
        </section >
        <AttributeLevels levels={levels} />
        {isParticipant &&
          <AttributeUserResponse
            assessment={assessment}
            userId={session?.user?.id}
            attributeId={assessmentAttribute.attributeId}
            levels={levels}
            userResponse={userResponses[0]}
          />
        }
        <Navigation
          urlHead={`/${assessmentType.id}/assessments/${assessment.id}/${params.roleName}/${part.name}`}
          isParticipant={isParticipant}
          userResponses={userResponses}
          prevAttribute={prevAttribute}
          nextAttribute={nextAttribute}
          canReview={hasUserSubmittedAllResponses}
        />
      </div >
    )
  }
}
