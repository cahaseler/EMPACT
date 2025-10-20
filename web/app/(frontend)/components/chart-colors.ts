import type { Chart, ChartDataset } from "chart.js";
import { DoughnutController, PolarAreaController } from "chart.js";

const BORDER_COLORS = [
  "rgb(54, 162, 235)",
  "rgb(255, 159, 64)",
  "rgb(75, 192, 192)",
  "rgb(255, 99, 132)",
  "rgb(153, 102, 255)",
  "rgb(4, 188, 67)",
  "rgb(186, 69, 184)",
  "rgb(232, 52, 52)",
  "rgb(42, 201, 222)",
  "rgb(49, 85, 255)",
  "rgb(212, 88, 255)",
  "rgb(38, 224, 147)",
  "rgb(93, 53, 255)",
  "rgb(228, 0, 150)",
  "rgb(95, 182, 64)",
  "rgb(255, 136, 222)",
  "rgb(228, 96, 0)",
  "rgb(4, 133, 117)",
];

const BACKGROUND_COLORS = BORDER_COLORS.map((color) =>
  color.replace("rgb(", "rgba(").replace(")", ", 0.2)")
);
function getBorderColor(i: number) {
  return BORDER_COLORS[i % BORDER_COLORS.length];
}
function getBackgroundColor(i: number) {
  return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
}
function colorizeDefaultDataset(dataset: ChartDataset, i: number) {
  dataset.borderColor = getBorderColor(i);
  dataset.backgroundColor = getBackgroundColor(i);
  return ++i;
}
function colorizeDoughnutDataset(dataset: ChartDataset, i: number) {
  dataset.backgroundColor = dataset.data.map(() => getBorderColor(i++));
  return i;
}
function colorizePolarAreaDataset(dataset: ChartDataset, i: number) {
  dataset.backgroundColor = dataset.data.map(() => getBackgroundColor(i++));
  return i;
}

function getColorizer(chart: Chart) {
  let i = 0;
  return (dataset: ChartDataset, datasetIndex: number) => {
    const controller = chart.getDatasetMeta(datasetIndex).controller;
    if (controller instanceof DoughnutController) {
      i = colorizeDoughnutDataset(dataset, i);
    } else if (controller instanceof PolarAreaController) {
      i = colorizePolarAreaDataset(dataset, i);
    } else if (controller) {
      i = colorizeDefaultDataset(dataset, i);
    }
  };
}

export const customChartColors = {
  id: "customChartColors",
  defaults: {
    enabled: true,
  },
  beforeLayout(chart: Chart, _args: any, options: any) {
    if (!options.enabled) {
      return;
    }
    const {
      data: { datasets },
    } = chart.config;
    const colorizer = getColorizer(chart);
    datasets.forEach(colorizer);
  },
};