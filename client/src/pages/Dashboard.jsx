/* Dashboard.jsx — Main IC View */
import { useState, useEffect } from 'react';
import { fetchMetrics, fetchInsights } from '../services/api';

import MetricCard       from '../components/MetricCard';
import InsightCard      from '../components/InsightCard';
import ActionCard       from '../components/ActionCard';
import MetricsChart     from '../components/MetricsChart';
import HealthScoreBadge from '../components/HealthScoreBadge';
import Loader           from '../components/Loader';

import './Dashboard.css';

/* ── Static descriptions per metric ─────────────────────────────────────── */
const DESCRIPTIONS = {
  leadTime:            'Time from PR opened → deployed to production',
  cycleTime:           'Time from task In Progress → Done',
  bugRate:             'Percentage of completed issues that were bugs',
  deploymentFrequency: 'Number of production deployments per month',
  prThroughput:        'Number of merged pull requests per month',
};

/* ── Helper: sum all month values ───────────────────────────────────────── */
const sumByMonth = (byMonth = {}) =>
  Object.values(byMonth).reduce((a, b) => a + b, 0);

/* ── Component ───────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [metrics,  setMetrics]  = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        /* Fire both requests in parallel */
        const [m, i] = await Promise.all([fetchMetrics(), fetchInsights()]);
        setMetrics(m);
        setInsights(i);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Loading ───────────────────────────────────────────── */
  if (loading) return <Loader />;

  /* ── Error ─────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <span className="error-card__icon">⚠️</span>
          <h2 className="error-card__title">Something went wrong</h2>
          <p className="error-card__message">{error}</p>
          <p className="error-card__hint">
            Make sure the backend server is running on port 5000.
          </p>
          <button
            className="error-card__btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── Extract data ───────────────────────────────────────── */
  const { meta, metrics: m, chartData } = metrics;
  const { healthScore, healthLabel, interpretations, suggestions, statuses } = insights;

  const metricCards = [
    { key:'leadTime',            label: m.leadTime.label,            value: m.leadTime.average,            unit: m.leadTime.unit,            status: statuses.leadTime,            desc: DESCRIPTIONS.leadTime },
    { key:'cycleTime',           label: m.cycleTime.label,           value: m.cycleTime.average,           unit: m.cycleTime.unit,           status: statuses.cycleTime,           desc: DESCRIPTIONS.cycleTime },
    { key:'bugRate',             label: m.bugRate.label,             value: m.bugRate.rate,                unit: m.bugRate.unit,             status: statuses.bugRate,             desc: DESCRIPTIONS.bugRate },
    { key:'deploymentFrequency', label: m.deploymentFrequency.label, value: m.deploymentFrequency.average, unit: m.deploymentFrequency.unit, status: statuses.deploymentFrequency, desc: DESCRIPTIONS.deploymentFrequency },
    { key:'prThroughput',        label: m.prThroughput.label,        value: m.prThroughput.average,        unit: m.prThroughput.unit,        status: statuses.prThroughput,        desc: DESCRIPTIONS.prThroughput },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="dashboard">

      {/* ══ Navigation ══════════════════════════════════════ */}
      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__brand">
            <span className="nav__brand-icon">📊</span>
            <div>
              <span className="nav__brand-name">DevMetrics</span>
              <span className="nav__brand-sub">IC Dashboard</span>
            </div>
          </div>
          <div className="nav__live">
            <span className="nav__live-dot" />
            Live · {today}
          </div>
        </div>
      </nav>

      {/* ══ Main Content ════════════════════════════════════ */}
      <main className="dashboard__main">

        {/* ── Section: Profile + Health Score ─────────────── */}
        <section className="profile-section">
          {/* Developer info */}
          <div className="profile-info">
            <div className="profile-info__header">
              <div className="profile-avatar">
                {meta.developerName.charAt(0)}
              </div>
              <div>
                <h1 className="profile-name">{meta.developerName}</h1>
                <p className="profile-role">{meta.role} · {meta.team}</p>
              </div>
            </div>

            <p className="profile-period">
              📅 Report period:{' '}
              {new Date(meta.reportPeriod.start).toLocaleDateString('en-US', { month:'long', year:'numeric' })}
              {' – '}
              {new Date(meta.reportPeriod.end).toLocaleDateString('en-US', { month:'long', year:'numeric' })}
            </p>

            {/* Quick stats */}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat__value">
                  {sumByMonth(m.prThroughput.byMonth)}
                </span>
                <span className="profile-stat__label">Total PRs Merged</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__value">{m.bugRate.bugCount}</span>
                <span className="profile-stat__label">Bugs Found</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__value">
                  {sumByMonth(m.deploymentFrequency.byMonth)}
                </span>
                <span className="profile-stat__label">Total Deploys</span>
              </div>
            </div>
          </div>

          {/* Health score ring */}
          <div className="profile-health">
            <HealthScoreBadge score={healthScore} label={healthLabel} />
          </div>
        </section>

        {/* ── Section: Metric Cards ────────────────────────── */}
        <section className="section">
          <h2 className="section__heading">
            <span aria-hidden="true">📈</span> Key Metrics
          </h2>
          <div className="metrics-grid">
            {metricCards.map(c => (
              <MetricCard
                key={c.key}
                label={c.label}
                value={c.value}
                unit={c.unit}
                status={c.status}
                description={c.desc}
              />
            ))}
          </div>
        </section>

        {/* ── Section: Charts ──────────────────────────────── */}
        <section className="section">
          <h2 className="section__heading">
            <span aria-hidden="true">📊</span> Visualisations
          </h2>
          <MetricsChart chartData={chartData} />
        </section>

        {/* ── Section: Insights ────────────────────────────── */}
        <section className="section">
          <div className="section__heading-row">
            <h2 className="section__heading">
              <span aria-hidden="true">🧠</span> Insights
            </h2>
            <span className="section__tag">Auto-generated</span>
          </div>
          <p className="section__sub">
            Here is what your metrics are telling us about your engineering workflow:
          </p>
          <div className="insights-grid">
            {interpretations.map((ins, i) => (
              <InsightCard key={i} {...ins} />
            ))}
          </div>
        </section>

        {/* ── Section: Suggested Actions ───────────────────── */}
        <section className="section">
          <div className="section__heading-row">
            <h2 className="section__heading">
              <span aria-hidden="true">⚡</span> Suggested Actions
            </h2>
            <span className="section__tag section__tag--green">
              {suggestions.length} recommendations
            </span>
          </div>
          <p className="section__sub">
            Practical steps you can take this sprint to improve your numbers:
          </p>
          <div className="actions-grid">
            {suggestions.map(s => (
              <ActionCard key={s.id} {...s} />
            ))}
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="dashboard__footer">
          DevMetrics MVP · Data refreshes on each page load · React + Express
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;