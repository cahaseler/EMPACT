"use client"
import { AssessmentType, Assessment, Part, Section, Attribute } from "@/prisma/mssql/generated/client"
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

export function DataTable({
    assessment, 
    assessmentType,
    part,
    section,
    attributes,
}: {
    assessment: Assessment | null, 
    assessmentType: AssessmentType | null,
    part: Part | null,
    section: Section | null,
    attributes: Attribute[]
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
                              <TableHead>Name</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Comments</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody className="cursor-pointer">
                          {attributes.map((attribute: Attribute, key: number) => (
                          <TableRow key={key} onClick={() =>
                              router.push(`/${assessmentType.id}/assessments/${assessment.id}/${part.name}/${section.id}/${attribute.id}`)
                          }>
                              <TableCell>{attribute.id.toString().toUpperCase()}. {attribute.name}</TableCell>
                              {/* TODO: Get attribute rating from AssessmentUserResponse */}
                              <TableCell></TableCell>
                              {/* TODO: Get attribute comments from AssessmentUserResponse */}
                              <TableCell></TableCell>
                          </TableRow>
                          ))}
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