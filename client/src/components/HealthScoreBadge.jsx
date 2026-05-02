/* HealthScoreBadge.jsx */
import './HealthScoreBadge.css';

const RADIUS        = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; /* ≈ 339.3 */

const getConfig = (score) => {
  if (score >= 80) return { color: 'var(--color-elite)', label: 'Excellent', cls: 'elite' };
  if (score >= 60) return { color: 'var(--color-good)',  label: 'Good',      cls: 'good' };
  if (score >= 40) return { color: 'var(--color-fair)',  label: 'Fair',      cls: 'fair' };
  return               { color: 'var(--color-poor)',  label: 'Needs Work', cls: 'poor' };
};

const HealthScoreBadge = ({ score, label }) => {
  const config  = getConfig(score);
  const offset  = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="health-badge">
      {/* SVG ring */}
      <div className="health-badge__ring-wrapper">
        <svg
          className="health-badge__svg"
          viewBox="0 0 128 128"
          aria-label={`Health score: ${score} out of 100`}
        >
          {/* Background track */}
          <circle
            cx="64" cy="64" r={RADIUS}
            className="health-badge__track"
          />
          {/* Progress arc */}
          <circle
            cx="64" cy="64" r={RADIUS}
            className="health-badge__progress"
            stroke={config.color}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Number inside ring */}
        <div className="health-badge__inner">
          <span
            className={`health-badge__score health-badge__score--${config.cls}`}
          >
            {score}
          </span>
          <span className="health-badge__denom">/ 100</span>
        </div>
      </div>

      {/* Labels below */}
      <p className={`health-badge__status-label health-badge__status-label--${config.cls}`}>
        {label}
      </p>
      <p className="health-badge__sub-label">Health Score</p>
    </div>
  );
};

export default HealthScoreBadge;    