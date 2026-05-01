/**
 * Date Utility Helpers
 */

/** Hours between two ISO date strings */
const diffInHours = (start, end) => {
  const ms = new Date(end) - new Date(start);
  return parseFloat((ms / 3_600_000).toFixed(2));
};

/** Days between two ISO date strings */
const diffInDays = (start, end) =>
  parseFloat((diffInHours(start, end) / 24).toFixed(2));

/** "YYYY-MM" key from an ISO date string */
const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/** Average of a number array, 2 decimal places */
const average = (nums) => {
  if (!nums.length) return 0;
  return parseFloat((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2));
};

module.exports = { diffInHours, diffInDays, monthKey, average };