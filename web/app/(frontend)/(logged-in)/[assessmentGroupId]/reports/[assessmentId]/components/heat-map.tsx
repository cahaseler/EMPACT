"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import {
  AssessmentPart,
  AssessmentUserGroup,
  Part,
  ScoreSummary
} from "@/prisma/mssql/generated/client"

import {
  Chart,
  ChartOptions,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Scatter } from "react-chartjs-2"

type Dataset = {
  groupName: string
  environment: number
  maturity: number
}[]

export default function HeatMap({
  groups,
  scores
}: Readonly<{
  groups: AssessmentUserGroup[],
  scores: (ScoreSummary & { assessmentPart: AssessmentPart & { part: Part } })[]
}>) {

  const dataset: Dataset = groups.map(group => {
    const groupScores = scores.filter(score => score.assessmentUserGroupId === group.id)
    const environment = groupScores.find(score => score.assessmentPart.part.name === "Environment")?.score || 0
    const maturity = groupScores.find(score => score.assessmentPart.part.name === "Maturity")?.score || 0

    return {
      groupName: group.name,
      environment,
      maturity
    }
  })

  const environmentAverage = Math.round(dataset.reduce((acc, item) => acc + item.environment, 0) / dataset.length)
  const maturityAverage = Math.round(dataset.reduce((acc, item) => acc + item.maturity, 0) / dataset.length)

  dataset.push({
    groupName: "Overall Total",
    environment: environmentAverage,
    maturity: maturityAverage
  })

  Chart.register(LinearScale, PointElement, Tooltip);

  const datasets = dataset.map(item => ({
    label: item.groupName,
    data: [{
      x: item.environment,
      y: item.maturity
    }],
    pointBorderColor: "rgb(49, 46, 129)",
    pointBackgroundColor: "rgb(49, 46, 129)"
  }))

  const options: ChartOptions<"scatter"> = {
    scales: {
      x: {
        min: 0,
        max: 1000,
        title: {
          display: true,
          text: "Environment",
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
      y: {
        min: 0,
        max: 1000,
        title: {
          display: true,
          text: "Maturity",
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
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        bodyColor: "rgb(49, 46, 129)",
        bodyFont: {
          size: 14,
          weight: "bold"
        },
        displayColors: false
      }
    }
  }

  const quadrants = {
    id: "quadrants",
    beforeDraw(chart: Chart) {
      const { ctx, chartArea: { left, top, right }, scales: { x, y } } = chart;
      if (x && y) {
        const x0 = x.getPixelForValue(0);
        const y0 = y.getPixelForValue(0);
        const x500 = x.getPixelForValue(500);
        const y500 = y.getPixelForValue(500);
        const x700 = x.getPixelForValue(700);
        const y700 = y.getPixelForValue(700);
        const x800 = x.getPixelForValue(800);
        const y800 = y.getPixelForValue(800);
        ctx.save();
        ctx.fillStyle = "rgb(255, 176, 176)";
        ctx.fillRect(left, top, right - x0, y0 - top);
        ctx.fillStyle = "rgb(255, 235, 176)";
        ctx.fillRect(x500, top, right - x500, y500 - top);
        ctx.fillStyle = "rgb(255, 255, 176)";
        ctx.fillRect(x700, top, right - x700, y700 - top);
        ctx.fillStyle = "rgb(221, 240, 201)";
        ctx.fillRect(x800, top, right - x800, y800 - top);
        ctx.restore();
      }
    }
  };

  return (
    <div className="w-full flex flex-col space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Heat Map</h2>
        <Scatter data={{ datasets }} options={options} plugins={[quadrants]} />
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Data</h3>
          <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
            <Table className="table-fixed text-xs dark:bg-transparent">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32 sticky left-0 bg-white dark:bg-[#171537]" />
                  {dataset.map(item => (
                    <TableHead key={item.groupName} className="w-32">{item.groupName}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Environment Score</TableHead>
                  {dataset.map(item => (
                    <TableCell key={item.groupName}>{item.environment}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Maturity Score</TableHead>
                  {dataset.map(item => (
                    <TableCell key={item.groupName}>{item.maturity}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Legend</h3>
        <div className="rounded-md border-2 border-indigo-100 dark:border-indigo-800">
          <Table className="table-fixed text-xs dark:bg-transparent">
            <TableHeader>
              <TableRow>
                <TableHead className="w-56 sticky left-0 bg-white dark:bg-[#171537]" />
                <TableHead className="w-40">
                  <span className="flex flex-row items-center">
                    <span className="mr-2 rounded-sm w-6 h-4 bg-[#ffb0b0] border border-red-400" /> Red
                  </span>
                </TableHead>
                <TableHead className="w-40">
                  <span className="flex flex-row items-center">
                    <span className="mr-2 rounded-sm w-6 h-4 bg-[#ffebb0] border border-amber-400" /> Orange
                  </span>
                </TableHead>
                <TableHead className="w-40">
                  <span className="flex flex-row items-center">
                    <span className="mr-2 rounded-sm w-6 h-4 bg-[#ffffb0] border border-yellow-400" /> Yellow
                  </span>
                </TableHead>
                <TableHead className="w-40">
                  <span className="flex flex-row items-center">
                    <span className="mr-2 rounded-sm w-6 h-4 bg-[#ddf0c9] border border-lime-500" /> Green
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Assessment Score</TableHead>
                <TableCell>{"< 500"}</TableCell>
                <TableCell>500 - 699</TableCell>
                <TableCell>700 - 799</TableCell>
                <TableCell>{"> 800"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Tuckman Model Stage</TableHead>
                <TableCell>Forming (0 - 10%)</TableCell>
                <TableCell>Storming (10 - 25%)</TableCell>
                <TableCell>Norming (25 - 40%)</TableCell>
                <TableCell>Performing {"(> 40%)"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">N Value</TableHead>
                <TableCell>6</TableCell>
                <TableCell>15</TableCell>
                <TableCell>7</TableCell>
                <TableCell>5</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Mean Cost Growth</TableHead>
                <TableCell>+92.3%</TableCell>
                <TableCell>+48.2%</TableCell>
                <TableCell>+13.7%</TableCell>
                <TableCell>-0.3%</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Mean Schedule Growth</TableHead>
                <TableCell>+24.3%</TableCell>
                <TableCell>+26.9%</TableCell>
                <TableCell>+3.8%</TableCell>
                <TableCell>-5.9%</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Compliance with NDIA EIA-748</TableHead>
                <TableCell>--</TableCell>
                <TableCell>--</TableCell>
                <TableCell>100%</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Meet Business Objectives</TableHead>
                <TableCell>--</TableCell>
                <TableCell>--</TableCell>
                <TableCell>4.4</TableCell>
                <TableCell>5.0</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">Customer Satisfaction</TableHead>
                <TableCell>--</TableCell>
                <TableCell>--</TableCell>
                <TableCell>4.4</TableCell>
                <TableCell>5.0</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-[#171537]">EVMS Helped Proactively Manage</TableHead>
                <TableCell>--</TableCell>
                <TableCell>--</TableCell>
                <TableCell>3.9</TableCell>
                <TableCell>4.0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
