/**
 * Insights Service
 * Classifies metric values into status levels (elite/good/fair/poor)
 * then generates human-readable interpretations and actionable suggestions.
 *
 * Thresholds are inspired by DORA benchmarks.
 */

const { getAllMetrics } = require('./metricsServices');

/* ── Thresholds ──────────────────────────────────────────────────────────── */

const THRESHOLDS = {
  /*  lower-is-better  */
  leadTime:  { elite: 1,  good: 3,  fair: 7  },
  cycleTime: { elite: 1,  good: 3,  fair: 5  },
  bugRate:   { elite: 10, good: 20, fair: 35 },
  /*  higher-is-better  */
  deploymentFrequency: { elite: 10, good: 4, fair: 2 },
  prThroughput:        { elite: 8,  good: 4, fair: 2 },
};

const LOWER_IS_BETTER = new Set(['leadTime', 'cycleTime', 'bugRate']);

/* ── Status Classifier ───────────────────────────────────────────────────── */

const getStatus = (metric, value) => {
  const t = THRESHOLDS[metric];
  if (!t) return 'unknown';

  if (LOWER_IS_BETTER.has(metric)) {
    if (value < t.elite) return 'elite';
    if (value < t.good)  return 'good';
    if (value < t.fair)  return 'fair';
    return 'poor';
  }

  /* Higher-is-better */
  if (value >= t.elite) return 'elite';
  if (value >= t.good)  return 'good';
  if (value >= t.fair)  return 'fair';
  return 'poor';
};

/* ── Interpretation Templates ────────────────────────────────────────────── */

const INTERPRETATIONS = {
  leadTime: {
    elite: (v) => ({ summary:'🚀 Excellent Lead Time!',           detail:`Your ${v}-day lead time is world-class. PRs flow from creation to production with minimal friction.` }),
    good:  (v) => ({ summary:'✅ Good Lead Time',                 detail:`${v} days average lead time is solid. Your delivery pipeline is working well.` }),
    fair:  (v) => ({ summary:'⚠️ Lead Time Needs Attention',      detail:`${v} days suggests bottlenecks between PR creation and deployment. Review steps are taking longer than ideal.` }),
    poor:  (v) => ({ summary:'🔴 Lead Time Is Too High',          detail:`${v} days is significantly above benchmarks. PRs are sitting in review or waiting for deployment too long.` }),
  },
  cycleTime: {
    elite: (v) => ({ summary:'🚀 Outstanding Cycle Time!',        detail:`Tasks completing in ${v} days — you are executing at elite pace.` }),
    good:  (v) => ({ summary:'✅ Healthy Cycle Time',             detail:`Completing tasks in ${v} days is commendable. Your workflow is efficient.` }),
    fair:  (v) => ({ summary:'⚠️ Tasks Are Getting Stuck',        detail:`A ${v}-day cycle time suggests mid-sprint blockers. Look for WIP bottlenecks.` }),
    poor:  (v) => ({ summary:'🔴 High Cycle Time — Tasks Stalling',detail:`${v} days average is a red flag. Unclear requirements, too many concurrent tasks, or slow reviews are likely causes.` }),
  },
  bugRate: {
    elite: (v,b,t) => ({ summary:'🚀 Excellent Code Quality!',   detail:`Only ${b} bugs from ${t} issues (${v}%). Testing and code review are highly effective.` }),
    good:  (v,b,t) => ({ summary:'✅ Good Quality Standards',    detail:`${b} bugs from ${t} issues (${v}%) is within acceptable range. Keep up test coverage.` }),
    fair:  (v,b,t) => ({ summary:'⚠️ Quality Issues Detected',   detail:`${v}% bug rate (${b}/${t} issues) suggests testing gaps. Some defects are escaping to production.` }),
    poor:  (v,b,t) => ({ summary:'🔴 High Bug Rate — Act Now',   detail:`${v}% (${b}/${t} issues) is concerning. Rushed reviews or missing tests are the usual culprits.` }),
  },
  deploymentFrequency: {
    elite: (v) => ({ summary:'🚀 Elite Deployment Cadence!',     detail:`Deploying ${v}×/month means continuous value delivery. Your CI/CD pipeline is well-optimised.` }),
    good:  (v) => ({ summary:'✅ Good Deployment Frequency',     detail:`${v} deployments/month is a healthy cadence — shipping regularly, small batches.` }),
    fair:  (v) => ({ summary:'⚠️ Deployment Frequency Is Modest',detail:`Only ${v}/month suggests large, risky release batches. Aim for smaller, more frequent deploys.` }),
    poor:  (v) => ({ summary:'🔴 Infrequent Deployments',        detail:`${v}/month is too low. Infrequent releases mean slow feedback loops and higher rollback risk.` }),
  },
  prThroughput: {
    elite: (v) => ({ summary:'🚀 High PR Throughput!',           detail:`Merging ${v} PRs/month shows exceptional output and reviewer collaboration.` }),
    good:  (v) => ({ summary:'✅ Solid PR Throughput',           detail:`${v} merged PRs/month reflects healthy velocity and consistent delivery.` }),
    fair:  (v) => ({ summary:'⚠️ PR Throughput Could Be Higher', detail:`${v} PRs/month is below expectations. PRs may be too large or review cycles too slow.` }),
    poor:  (v) => ({ summary:'🔴 Low PR Throughput',             detail:`Only ${v} PRs/month. Either PRs are very large or review bottlenecks are blocking merges.` }),
  },
};

const interpret = (metric, status, value, extra = []) =>
  INTERPRETATIONS[metric][status](value, ...extra);

/* ── Suggestion Generator ────────────────────────────────────────────────── */

const generateSuggestions = (statuses) => {
  const s = [];

  if (['poor','fair'].includes(statuses.leadTime)) {
    s.push({
      id: 'sug-01', metric: 'Lead Time',
      priority: statuses.leadTime === 'poor' ? 'high' : 'medium',
      icon: '⚡', action: 'Improve PR Review Turnaround',
      detail: 'Set a 24-hour team SLA for reviews. Assign dedicated reviewers and open draft PRs early for async feedback. Unreviewed PRs are the #1 lead-time killer.',
    });
  }

  if (['poor','fair'].includes(statuses.cycleTime)) {
    s.push({
      id: 'sug-02', metric: 'Cycle Time',
      priority: statuses.cycleTime === 'poor' ? 'high' : 'medium',
      icon: '✂️', action: 'Break Tasks into Smaller Vertical Slices',
      detail: 'Aim for tasks completable in 1–2 days. Split by vertical slice (UI + API + tests together). Smaller scope = faster feedback = lower cycle time.',
    });
    s.push({
      id: 'sug-03', metric: 'Cycle Time',
      priority: 'medium',
      icon: '🎯', action: 'Cap Your Work In Progress (WIP)',
      detail: 'Limit yourself to 2–3 active tasks. Context switching between many tasks inflates cycle time. Use a personal Kanban board to make WIP visible.',
    });
  }

  if (['poor','fair'].includes(statuses.bugRate)) {
    s.push({
      id: 'sug-04', metric: 'Bug Rate',
      priority: statuses.bugRate === 'poor' ? 'high' : 'medium',
      icon: '🧪', action: 'Strengthen Pre-Merge Testing',
      detail: 'Write unit tests for all new features before raising a PR. Consider TDD for bug-prone modules. Enforce ≥80% coverage in CI to catch regressions early.',
    });
    s.push({
      id: 'sug-05', metric: 'Bug Rate',
      priority: 'medium',
      icon: '🔍', action: 'Run a Bug Root-Cause Retrospective',
      detail: 'For each recent bug: document why it was missed. Common patterns — missing edge cases, unclear acceptance criteria, insufficient reviewer focus.',
    });
  }

  if (['poor','fair'].includes(statuses.deploymentFrequency)) {
    s.push({
      id: 'sug-06', metric: 'Deployment Frequency',
      priority: 'medium',
      icon: '🚩', action: 'Adopt Feature Flags for Safer Frequent Deploys',
      detail: 'Feature flags decouple deploy from release. Ship incomplete features behind a flag — enables daily deployments even for in-progress work.',
    });
  }

  if (['poor','fair'].includes(statuses.prThroughput)) {
    s.push({
      id: 'sug-07', metric: 'PR Throughput',
      priority: 'medium',
      icon: '📦', action: 'Keep PRs Small and Focused',
      detail: 'Target <400 lines changed per PR. One PR = one logical change. Small PRs are reviewed faster, merged sooner, and produce fewer conflicts.',
    });
  }

  /* All green — positive reinforcement */
  if (s.length === 0) {
    s.push({
      id: 'sug-08', metric: 'All Metrics',
      priority: 'low',
      icon: '🌟', action: 'Maintain Momentum & Share Your Practices',
      detail: 'All metrics look healthy! Consider writing an internal blog post or running a team demo of your workflow. Great engineering culture compounds.',
    });
  }

  /* Sort high → medium → low, cap at 4 */
  const order = { high: 0, medium: 1, low: 2 };
  return s.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 4);
};

/* ── Main Aggregator ─────────────────────────────────────────────────────── */

const getAllInsights = () => {
  const { metrics, meta } = getAllMetrics();
  const M = metrics;

  const statuses = {
    leadTime:            getStatus('leadTime',            M.leadTime.average),
    cycleTime:           getStatus('cycleTime',           M.cycleTime.average),
    bugRate:             getStatus('bugRate',             M.bugRate.rate),
    deploymentFrequency: getStatus('deploymentFrequency', M.deploymentFrequency.average),
    prThroughput:        getStatus('prThroughput',        M.prThroughput.average),
  };

  const interpretations = [
    { metric:'Lead Time',            value: M.leadTime.average,            unit: M.leadTime.unit,            status: statuses.leadTime,            ...interpret('leadTime',            statuses.leadTime,            M.leadTime.average) },
    { metric:'Cycle Time',           value: M.cycleTime.average,           unit: M.cycleTime.unit,           status: statuses.cycleTime,           ...interpret('cycleTime',           statuses.cycleTime,           M.cycleTime.average) },
    { metric:'Bug Rate',             value: M.bugRate.rate,                unit: M.bugRate.unit,             status: statuses.bugRate,             ...interpret('bugRate',             statuses.bugRate,             M.bugRate.rate, [M.bugRate.bugCount, M.bugRate.totalCount]) },
    { metric:'Deployment Frequency', value: M.deploymentFrequency.average, unit: M.deploymentFrequency.unit, status: statuses.deploymentFrequency, ...interpret('deploymentFrequency', statuses.deploymentFrequency, M.deploymentFrequency.average) },
    { metric:'PR Throughput',        value: M.prThroughput.average,        unit: M.prThroughput.unit,        status: statuses.prThroughput,        ...interpret('prThroughput',        statuses.prThroughput,        M.prThroughput.average) },
  ];

  /* Health score: elite=4, good=3, fair=2, poor=1 → normalised to 100 */
  const scoreMap  = { elite: 4, good: 3, fair: 2, poor: 1 };
  const raw       = Object.values(statuses).reduce((sum, s) => sum + (scoreMap[s] || 0), 0);
  const maxRaw    = Object.keys(statuses).length * 4;
  const healthScore = Math.round((raw / maxRaw) * 100);

  return {
    meta,
    healthScore,
    healthLabel:     healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Needs Work',
    statuses,
    interpretations,
    suggestions:     generateSuggestions(statuses),
    generatedAt:     new Date().toISOString(),
  };
};

module.exports = { getAllInsights, getStatus };