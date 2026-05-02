/* MetricsChart.jsx */
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './MetricsChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* Shared Chart.js theme options */
const baseOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color:    '#9090b0',
        font:     { size: 12, family: "'Inter', sans-serif" },
        boxWidth: 12,
        padding:  16,
      },
    },
    tooltip: {
      backgroundColor: '#1a1a24',
      titleColor:      '#f0f0f8',
      bodyColor:       '#9090b0',
      borderColor:     '#2a2a38',
      borderWidth:     1,
      padding:         10,
      cornerRadius:    8,
    },
  },
  scales: {
    x: {
      grid:  { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#5a5a7a', font: { size: 11 } },
    },
    y: {
      grid:        { color: 'rgba(255,255,255,0.04)' },
      ticks:       { color: '#5a5a7a', font: { size: 11 } },
      beginAtZero: true,
    },
  },
};

const MetricsChart = ({ chartData }) => {
  if (!chartData) return null;

  /* ── Overview Bar Chart ─────────────────────────────────── */
  const overviewData = {
    labels: chartData.labels,
    datasets: [{
      label:           'Your Value',
      data:            chartData.values,
      backgroundColor: [
        'rgba(99,  102, 241, 0.75)',
        'rgba(34,  197,  94, 0.75)',
        'rgba(245, 158,  11, 0.75)',
        'rgba(59,  130, 246, 0.75)',
        'rgba(168,  85, 247, 0.75)',
      ],
      borderColor: [
        '#6366f1', '#22c55e', '#f59e0b', '#3b82f6', '#a855f7',
      ],
      borderWidth:  2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  /* ── Monthly Trend Chart ────────────────────────────────── */
  const trend      = chartData.monthlyTrend;
  const trendData  = {
    labels: trend.map(d => d.month),
    datasets: [
      {
        label:           'Deployments',
        data:            trend.map(d => d.deployments),
        backgroundColor: 'rgba(99,102,241, 0.7)',
        borderColor:     '#6366f1',
        borderWidth:     2,
        borderRadius:    6,
      },
      {
        label:           'Merged PRs',
        data:            trend.map(d => d.mergedPRs),
        backgroundColor: 'rgba(34,197,94, 0.7)',
        borderColor:     '#22c55e',
        borderWidth:     2,
        borderRadius:    6,
      },
    ],
  };

  const overviewOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      title: {
        display:  true,
        text:     'Metrics Overview',
        color:    '#f0f0f8',
        font:     { size: 13, weight: '600' },
        padding:  { bottom: 16 },
      },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => {
            const units = ['days', 'days', '%', '/mo', '/mo'];
            return `  ${ctx.parsed.y} ${units[ctx.dataIndex] || ''}`;
          },
        },
      },
    },
  };

  const trendOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      title: {
        display: true,
        text:    'Monthly Trend',
        color:   '#f0f0f8',
        font:    { size: 13, weight: '600' },
        padding: { bottom: 16 },
      },
    },
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-card__inner">
          <Bar data={overviewData} options={overviewOptions} />
        </div>
      </div>
      <div className="chart-card">
        <div className="chart-card__inner">
          <Bar data={trendData}    options={trendOptions} />
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;