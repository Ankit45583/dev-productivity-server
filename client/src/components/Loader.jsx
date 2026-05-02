import './Loader.css';

const Loader = () => (
  <div className="loader-root">
    <div className="loader-spinner" aria-hidden="true" />
    <p className="loader-text">Loading your productivity metrics…</p>
  </div>
);

export default Loader;