import { Level } from "@/prisma/mssql/generated/client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"

export default function AttributeLevels({ levels }: {
  readonly levels: Level[]
}) {
  return (
    <section className="mb-8 space-y-4">

      <Accordion
        type="single"
        collapsible={true}
        className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
      >
        <AccordionItem value="levels" className="last:border-b-0 group">
          <AccordionTrigger className="mx-4 text-left hover:no-underline">
            <h2 className="text-indigo-950 dark:text-indigo-200 text-2xl font-bold max-lg:ml-2">Levels</h2>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg">
            <Accordion
              type="single"
              collapsible={true}
              className="bg-indigo-50/60 dark:bg-black/60 rounded-lg border-2 border-indigo-100 dark:border-indigo-900"
            >
              {levels.map((level: Level, key: number) => (
                <AccordionItem key={key} value={level.level.toString()} className="last:border-b-0 group">
                  <AccordionTrigger
                    className="text-indigo-900 dark:text-indigo-200 md:text-lg text-left font-bold mx-4 hover:no-underline"
                  >
                    {level.level} - {level.shortDescription}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-4 bg-white dark:bg-indigo-600/20 group-last:rounded-b-lg">
                    <div dangerouslySetInnerHTML={{ __html: level.longDescription }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}