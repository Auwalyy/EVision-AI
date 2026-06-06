export const priorityClass = (priority) => {
  const map = { Critical: 'badge-critical', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
  return map[priority] || 'badge-low';
};

export const priorityColor = (priority) => {
  const map = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };
  return map[priority] || '#22c55e';
};

export const formatCurrency = (n) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(0)}K`
    : `$${n}`;

export const scoreColor = (score) => {
  if (score >= 80) return '#ef4444';
  if (score >= 65) return '#f97316';
  if (score >= 50) return '#eab308';
  return '#22c55e';
};
