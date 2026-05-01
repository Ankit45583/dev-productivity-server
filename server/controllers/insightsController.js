const { getAllInsights } = require('../services/insightsServices');

const getInsights = (_req, res) => {
  try {
    res.json({ success: true, data: getAllInsights() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to generate insights' });
  }
};

module.exports = { getInsights };