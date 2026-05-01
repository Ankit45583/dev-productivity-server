const { getAllMetrics } = require('../services/metricsServices.js');

const getMetrics = (_req, res) => {
  try {
    res.json({ success: true, data: getAllMetrics() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to compute metrics' });
  }
};

module.exports = { getMetrics };