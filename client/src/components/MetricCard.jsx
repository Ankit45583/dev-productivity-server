/* MetricCard.jsx */
import './MetricCard.css';

/* Icon map — one emoji per metric */
const ICONS = {
  'Lead Time':             '⏱️',
  'Cycle Time':            '🔄',
  'Bug Rate':              '🐛',
  'Deployment Frequency':  '🚀',
  'PR Throughput':         '📦',
};

const STATUS_LABELS = {
  elite: 'Elite',
  good:  'Good',
  fair:  'Needs Work',
  poor:  'Critical',
};

const MetricCard = ({ label, value, unit, status, description }) => {
  /* Format value: integers show no decimal, floats show one */
  const displayValue =
    typeof value === 'number'
      ? value % 1 === 0
        ? value.toString()
        : value.toFixed(1)
      : value;

  return (
    <article className={`metric-card metric-card--${status}`}>
      {/* ── Header ───────────────────────────────────────── */}
      <div className="metric-card__header">
        <span className="metric-card__icon" aria-hidden="true">
          {ICONS[label] || '📊'}
        </span>
        <span className={`metric-card__badge metric-card__badge--${status}`}>
          <span className="metric-card__badge-dot" />
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      {/* ── Label ────────────────────────────────────────── */}
      <p className="metric-card__label">{label}</p>

      {/* ── Value ────────────────────────────────────────── */}
      <div className="metric-card__value-row">
        <span className="metric-card__value">{displayValue}</span>
        <span className="metric-card__unit">{unit}</span>
      </div>

      {/* ── Description ──────────────────────────────────── */}
      {description && (
        <p className="metric-card__description">{description}</p>
      )}
    </article>
  );
};

export default MetricCard;