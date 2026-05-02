/* InsightCard.jsx */
import './InsightCard.css';

const InsightCard = ({ metric, summary, detail, value, unit, status }) => (
  <article className={`insight-card insight-card--${status}`}>
    {/* Top row: metric name + value */}
    <div className="insight-card__top">
      <span className={`insight-card__metric-tag insight-card__metric-tag--${status}`}>
        {metric}
      </span>
      <span className="insight-card__value">
        {value} <span className="insight-card__unit">{unit}</span>
      </span>
    </div>

    {/* Summary headline */}
    <h3 className="insight-card__summary">{summary}</h3>

    {/* Detailed explanation */}
    <p className="insight-card__detail">{detail}</p>
  </article>
);

export default InsightCard;