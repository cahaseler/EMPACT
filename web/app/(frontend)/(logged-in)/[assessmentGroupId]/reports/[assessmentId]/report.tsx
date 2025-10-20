"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button"

import HeatMap from "./components/heat-map";
import GapAnalysis from "./components/gap-analysis";
import PopulationDensity from "./components/pop-density";

import {
  AssessmentAttribute,
  AssessmentPart,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Attribute,
  Level,
  Section,
  Part,
  ScoreSummary,
  User
} from "@/prisma/mssql/generated/client"

export default function AssessmentReport({
  assessmentId,
  groups,
  scores,
  assessmentAttributes
}: Readonly<{
  assessmentId: number
  groups: (AssessmentUserGroup & {
    assessmentUser: (AssessmentUser & {
      user: User & {
        assessmentUserResponse: (AssessmentUserResponse & {
          user: User;
          level: Level;
        })[];
      };
    })[]
  })[]
  scores: (ScoreSummary & {
    assessmentPart: AssessmentPart & {
      part: Part
    }
  })[]
  assessmentAttributes: (AssessmentAttribute & {
    attribute: Attribute & {
      levels: Level[],
      section: Section & {
        part: Part & {
          assessmentPart: AssessmentPart[]
        }
      }
    }
  })[]
}>) {

  const [report, setReport] = useState("Heat Map")

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-row space-x-4">
        <Button onClick={() => setReport("Heat Map")}>
          Heat Map
        </Button>
        <Button onClick={() => setReport("Gap Analysis")}>
          Gap Analysis
        </Button>
        <Button onClick={() => setReport("Population Density")}>
          Population Density Chart
        </Button>
      </div>
      {report === "Heat Map" && <HeatMap groups={groups} scores={scores} />}
      {report === "Gap Analysis" &&
        <GapAnalysis
          assessmentId={assessmentId}
          groups={groups}
          assessmentAttributes={assessmentAttributes}
        />
      }
      {report === "Population Density" &&
        <PopulationDensity
          assessmentId={assessmentId}
          groups={groups}
          assessmentAttributes={assessmentAttributes}
        />
      }
    </div>
  )
}
