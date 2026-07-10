import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export const chartTheme = {
  primary: "#22C55E",
  secondary: "#14B8A6",
  accent: "#06B6D4",
  warning: "#F59E0B",
  error: "#EF4444",
  line: "#E5E7EB",
  body: "#334155",
};

export const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: chartTheme.body, font: { family: "Inter", size: 12 } },
    },
    tooltip: {
      backgroundColor: "#0F172A",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#E5E7EB",
      cornerRadius: 8,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: chartTheme.line },
      ticks: { color: chartTheme.body },
    },
    y: {
      grid: { color: chartTheme.line },
      ticks: { color: chartTheme.body },
      beginAtZero: true,
    },
  },
};
