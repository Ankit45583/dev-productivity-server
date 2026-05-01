/**
 * Metrics Service — all calculation logic
 */

// ✅ FIXED: go up ONE level from services/ to reach utils/ and data/
const { diffInDays, monthKey, average } = require('../utils/dateUtils');
const mockData = require('../data/mockData');

/* ── Lead Time ───────────────────────────────────────────────────────────── */

const calculateLeadTime = (prs) => {
  const deployed = prs.filter(p => p.deployedAt);
  const values   = deployed.map(p => ({
    id:       p.id,
    title:    p.title,
    leadTime: diffInDays(p.openedAt, p.deployedAt),
  }));
  return {
    label:      'Lead Time',
    unit:       'days',
    average:    average(values.map(v => v.leadTime)),
    individual: values,
  };
};

/* ── Cycle Time ──────────────────────────────────────────────────────────── */

const calculateCycleTime = (issues) => {
  const done   = issues.filter(i => i.completedAt);
  const values = done.map(i => ({
    id:        i.id,
    title:     i.title,
    type:      i.type,
    cycleTime: diffInDays(i.startedAt, i.completedAt),
  }));
  return {
    label:      'Cycle Time',
    unit:       'days',
    average:    average(values.map(v => v.cycleTime)),
    individual: values,
  };
};

/* ── Bug Rate ────────────────────────────────────────────────────────────── */

const calculateBugRate = (issues) => {
  const done = issues.filter(i => i.completedAt);
  const bugs = done.filter(i => i.type === 'bug');
  const rate = done.length
    ? parseFloat(((bugs.length / done.length) * 100).toFixed(2))
    : 0;
  return {
    label:      'Bug Rate',
    unit:       '%',
    rate,
    bugCount:   bugs.length,
    totalCount: done.length,
  };
};

/* ── Deployment Frequency ────────────────────────────────────────────────── */

const calculateDeploymentFrequency = (deployments) => {
  const byMonth = {};
  deployments.forEach(d => {
    const k    = monthKey(d.deployedAt);
    byMonth[k] = (byMonth[k] || 0) + 1;
  });
  return {
    label:   'Deployment Frequency',
    unit:    'per month',
    average: average(Object.values(byMonth)),
    byMonth,
  };
};

/* ── PR Throughput ───────────────────────────────────────────────────────── */

const calculatePRThroughput = (prs) => {
  const merged  = prs.filter(p => p.mergedAt);
  const byMonth = {};
  merged.forEach(p => {
    const k    = monthKey(p.mergedAt);
    byMonth[k] = (byMonth[k] || 0) + 1;
  });
  return {
    label:   'PR Throughput',
    unit:    'per month',
    average: average(Object.values(byMonth)),
    byMonth,
  };
};

/* ── Monthly Trend ───────────────────────────────────────────────────────── */

const buildMonthlyTrend = (deployments, prs) => {
  const months = ['2024-01', '2024-02'];
  return months.map(m => ({
    month:       m,
    deployments: deployments.filter(d => monthKey(d.deployedAt) === m).length,
    mergedPRs:   prs.filter(p => p.mergedAt && monthKey(p.mergedAt) === m).length,
  }));
};

/* ── Main Aggregator ─────────────────────────────────────────────────────── */

const getAllMetrics = () => {
  const { pullRequests, issues, deployments, meta } = mockData;

  const leadTime            = calculateLeadTime(pullRequests);
  const cycleTime           = calculateCycleTime(issues);
  const bugRate             = calculateBugRate(issues);
  const deploymentFrequency = calculateDeploymentFrequency(deployments);
  const prThroughput        = calculatePRThroughput(pullRequests);

  return {
    meta,
    metrics: { leadTime, cycleTime, bugRate, deploymentFrequency, prThroughput },
    chartData: {
      labels: [
        'Lead Time (days)',
        'Cycle Time (days)',
        'Bug Rate (%)',
        'Deploy Freq /mo',
        'PR Throughput /mo',
      ],
      values: [
        leadTime.average,
        cycleTime.average,
        bugRate.rate,
        deploymentFrequency.average,
        prThroughput.average,
      ],
      monthlyTrend: buildMonthlyTrend(deployments, pullRequests),
    },
    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  getAllMetrics,
  calculateLeadTime,
  calculateCycleTime,
  calculateBugRate,
  calculateDeploymentFrequency,
  calculatePRThroughput,
};