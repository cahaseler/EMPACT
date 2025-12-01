"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button"

import {
  AssessmentPart,
  AssessmentUser,
  AssessmentUserGroup,
  AssessmentUserResponse,
  Attribute,
  Level,
  Section,
  Part,
  User
} from "@/prisma/mssql/generated/client"

import {
  CategoryScale,
  Chart,
  ChartDataset,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { customChartColors } from "../../../../../components/chart-colors"
import { Line } from "react-chartjs-2"

type Dataset = {
  groupName: string
  datapoints: {
    level: string
    x: number,
    y: number
  }[]
}[]

export default function PopulationDensity({
  assessmentId,
  groups,
  attributes
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
  attributes: (Attribute & {
    levels: Level[],
    section: Section & {
      part: Part & {
        assessmentPart: AssessmentPart[]
      }
    }
  })[]
}>) {

  const [currentAttribute, setCurrentAttribute] = useState(attributes[0])

  const maxLevelWeight = currentAttribute ? Math.max(...currentAttribute.levels.map(level => level.weight)) : 0

  const labels = currentAttribute ? currentAttribute.levels.map(level => `Level ${level.level}: ${level.weight}`) : []

  const dataset: Dataset = groups.map(group => {

    if (currentAttribute) {

      const groupAttributeResponses = group.assessmentUser.flatMap(
        (assessmentUser) => assessmentUser.user.assessmentUserResponse
      ).filter(
        (assessmentUserResponse) =>
          assessmentUserResponse.assessmentId === assessmentId &&
          assessmentUserResponse.assessmentUserGroupId === group.id &&
          assessmentUserResponse.attributeId === currentAttribute.id
      )

      const datapoints = currentAttribute.levels.map(level => {

        const levelResponses = groupAttributeResponses.filter(
          (assessmentUserResponse) => assessmentUserResponse.levelId === level.id
        )

        return {
          level: `Level ${level.level}: ${level.weight}`,
          x: level.weight,
          y: levelResponses.length
        }

      })

      return {
        groupName: group.name,
        datapoints
      }

    }

    return {
      groupName: group.name,
      datapoints: []
    }

  })

  Chart.register(CategoryScale, customChartColors, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip);

  const datasets: ChartDataset<"line">[] = dataset.map(item => ({
    label: item.groupName,
    data: item.datapoints,
    borderWidth: 1.5,
    fill: true,
    tension: 0.3,
    pointBorderColor: "rgb(49, 46, 129)",
    pointBackgroundColor: "rgb(49, 46, 129)"
  }))

  const allGroupAttributeResponses = groups.flatMap(
    group => group.assessmentUser.flatMap(
      (assessmentUser) => assessmentUser.user.assessmentUserResponse
    ).filter(
      (assessmentUserResponse) =>
        assessmentUserResponse.assessmentId === assessmentId &&
        assessmentUserResponse.assessmentUserGroupId === group.id &&
        assessmentUserResponse.attributeId === currentAttribute?.id
    ))
  const average = allGroupAttributeResponses.reduce((a, b) => a + b.level.weight, 0) / allGroupAttributeResponses.length
  const median = allGroupAttributeResponses.sort((a, b) => a.level.weight - b.level.weight)[Math.floor(allGroupAttributeResponses.length / 2)]?.level.weight

  datasets.push({
    label: "Mean",
    data: [{ x: average, y: 0 }, { x: average, y: 16 }],
    borderWidth: 1.5,
    pointRadius: 0
  })

  datasets.push({
    label: "Median",
    data: [{ x: median || 0, y: 0 }, { x: median || 0, y: 16 }],
    borderWidth: 1.5,
    pointRadius: 0
  })

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: maxLevelWeight,
        position: "bottom",
        title: {
          display: true,
          text: "Score",
          color: "rgb(99, 102, 241)",
          font: {
            size: 16,
            weight: "bold"
          }
        },
        ticks: {
          color: "rgb(129, 140, 248)",
          font: {
            size: 14
          }
        }
      },
      x2: {
        type: "category",
        labels,
        position: "top",
        ticks: {
          color: "rgb(129, 140, 248)",
          font: {
            size: 14
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 16,
        title: {
          display: true,
          text: "Density of Datapoints",
          color: "rgb(99, 102, 241)",
          font: {
            size: 16,
            weight: "bold"
          }
        },
        ticks: {
          color: "rgb(129, 140, 248)",
          font: {
            size: 14
          }
        }
      },
    },
    plugins: {
      filler: {
        propagate: true
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "rgb(99, 102, 241)",
          font: {
            size: 14,
            weight: "bold"
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        bodyColor: "rgb(49, 46, 129)",
        bodyFont: {
          size: 14,
          weight: "bold"
        },
        displayColors: false,
        titleFont: {
          size: 0
        },
      }
    }
  }

  return (
    <div className="w-full flex flex-col space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Population Density Chart</h2>
        <h3 className="text-lg font-bold">{currentAttribute?.id}. {currentAttribute?.name}</h3>
        <Line data={{ datasets }} options={options} />
        <h3 className="text-xl font-bold">Factors</h3>
        <div className="flex flex-row flex-wrap gap-4">
          {attributes.map((attribute) => (
            <Button
              key={attribute.id}
              onClick={() => setCurrentAttribute(attribute)}
              disabled={currentAttribute && currentAttribute.id === attribute.id}
            >
              {attribute.id}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
