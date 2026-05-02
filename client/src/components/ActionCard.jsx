/* ActionCard.jsx */
import './ActionCard.css';

const PRIORITY_LABELS = {
  high:   'High Priority',
  medium: 'Medium Priority',
  low:    'Low Priority',
};

const ActionCard = ({ action, detail, icon, metric, priority }) => (
  <article className={`action-card action-card--${priority}`}>
    {/* Top row: priority + metric tag */}
    <div className="action-card__top">
      <span className={`action-card__priority action-card__priority--${priority}`}>
        {PRIORITY_LABELS[priority] || priority}
      </span>
      <span className="action-card__metric-tag">{metric}</span>
    </div>

    {/* Icon + action title */}
    <div className="action-card__title-row">
      <span className="action-card__icon" aria-hidden="true">{icon}</span>
      <h3 className="action-card__title">{action}</h3>
    </div>

    {/* Detail */}
    <p className="action-card__detail">{detail}</p>
  </article>
);

export default ActionCard;