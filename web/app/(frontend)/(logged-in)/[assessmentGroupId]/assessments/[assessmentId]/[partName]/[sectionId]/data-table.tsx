"use client"
import { 
  AssessmentType, 
  Assessment, 
  Part, 
  Section, 
  Attribute, 
  Level,
  AssessmentUserResponse 
} from "@/prisma/mssql/generated/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import Breadcrumbs from "@/app/(frontend)/components/breadcrumbs"
import NotFound from "@/app/(frontend)/components/notFound"

import { useRouter } from "next/navigation"

// TODO: Convert to React-Table
// TODO: Filtering, sorting, search, pagination

export default function DataTable({
    assessment, 
    assessmentType,
    part,
    section,
    attributes,
    userResponses,
    isParticipant
}: {
    assessment: Assessment | null, 
    assessmentType: AssessmentType | null,
    part: Part | null,
    section: Section | null,
    attributes: (Attribute & { levels: Level[] })[],
    userResponses: AssessmentUserResponse[],
    isParticipant: boolean
}) {
  const router = useRouter()
  if(assessmentType) {
    const links = [
      {
        url: `/${assessmentType.id}/assessments`,
        name: assessmentType.name
      }
    ]
    if(assessment) {
      links.push({
        url: `/${assessmentType.id}/assessments/${assessment.id}`,
        name: assessment.name
      });
      if (part) {
        links.push({
          url: `/${assessmentType.id}/assessments/${assessment.id}/${part.name}`,
          name: part.name
        });
        if (section) {
          return (
              <div className="w-full max-w-4xl mx-auto">
              <section className="mb-8">
                <div className="space-y-4 max-lg:ml-2">
                  <Breadcrumbs links={links} currentPage={`${section.id.toString().toUpperCase()}. ${section.name}`} />
                  <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter">{section.id.toString().toUpperCase()}. {section.name}</h1>
                      <p className="text-sm text-muted-foreground dark:text-indigo-300/80">
                          {section.description}
                      </p>
                  </div>
                </div>
              </section>
              <section className="mb-16">
                  <Table className="dark:bg-transparent">
                      <TableHeader>
                          <TableRow>
                              <TableHead>{part.attributeType}</TableHead>
                              {isParticipant ? 
                                <>
                                  <TableHead>Rating</TableHead>
                                  <TableHead>Comments</TableHead>
                                </> : 
                                <TableHead>Number of Submitted Responses</TableHead>
                              }
                          </TableRow>
                      </TableHeader>
                      <TableBody className="cursor-pointer">
                          {attributes.map((attribute: Attribute & { levels: Level[] }, key: number) => {
                          const attributeResponses = userResponses.filter((userResponse: AssessmentUserResponse) => userResponse.attributeId === attribute.id)
                          const level = attributeResponses.length > 0 ? attribute.levels.find((level: Level) => level.id === attributeResponses[0].levelId) : undefined
                          return (
                            <TableRow key={key} onClick={() =>
                                router.push(`/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}/${attribute.id}`)
                            }>
                                <TableCell>{attribute.id.toString().toUpperCase()}. {attribute.name}</TableCell>
                                {isParticipant ? 
                                  <>
                                    <TableCell>{level?.level}</TableCell>
                                    <TableCell>{attributeResponses.length > 0 && attributeResponses[0].notes}</TableCell>
                                  </> : 
                                  <TableCell>{attributeResponses.length}</TableCell>
                                }
                            </TableRow>
                          )})}
                      </TableBody>
                  </Table>
              </section>
            </div>
          )
        }
        return <NotFound links={links} pageType="section" />
      }
      return <NotFound links={links} pageType="part" />
    }
    return <NotFound links={links} pageType="assessment" />
  }
  return <NotFound pageType="type" />
}