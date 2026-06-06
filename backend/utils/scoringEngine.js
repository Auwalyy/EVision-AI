/**
 * EVision AI — Demand Prediction & Investment Scoring Engine
 * SageMaker-ready architecture (local scoring for MVP)
 */

const WEIGHTS = {
  populationDensity: 0.4,
  trafficVolume: 0.3,
  commercialScore: 0.2,
  evScore: 0.1,
};

const CHARGER_COST_USD = 35000; // per DC fast charger
const AVG_REVENUE_PER_CHARGER_MONTHLY = 1200;

function calcDemandScore(loc) {
  return Math.round(
    loc.populationDensity * WEIGHTS.populationDensity +
      loc.trafficVolume * WEIGHTS.trafficVolume +
      loc.commercialScore * WEIGHTS.commercialScore +
      loc.evScore * WEIGHTS.evScore
  );
}

function calcInvestmentScore(demandScore, loc) {
  const accessScore = Math.min(100, (loc.commercialScore + loc.trafficVolume) / 2);
  const riskPenalty = loc.evScore < 20 ? 10 : 0;
  return Math.min(100, Math.round(demandScore * 0.6 + accessScore * 0.4 - riskPenalty));
}

function calcChargersNeeded(demandScore) {
  if (demandScore >= 85) return 8;
  if (demandScore >= 70) return 5;
  if (demandScore >= 50) return 3;
  return 2;
}

function calcEstimatedROI(chargersNeeded, demandScore) {
  const monthlyRevenue = chargersNeeded * AVG_REVENUE_PER_CHARGER_MONTHLY * (demandScore / 100);
  const totalCost = chargersNeeded * CHARGER_COST_USD;
  return Math.round((monthlyRevenue * 12) / totalCost * 100); // annual ROI %
}

function calcPaybackPeriod(chargersNeeded, demandScore) {
  const monthlyRevenue = chargersNeeded * AVG_REVENUE_PER_CHARGER_MONTHLY * (demandScore / 100);
  const totalCost = chargersNeeded * CHARGER_COST_USD;
  return Math.round(totalCost / monthlyRevenue);
}

function getPriority(demandScore) {
  if (demandScore >= 85) return 'Critical';
  if (demandScore >= 70) return 'High';
  if (demandScore >= 50) return 'Medium';
  return 'Low';
}

function getRiskLevel(loc) {
  if (loc.evScore < 20 && loc.trafficVolume < 30) return 'High';
  if (loc.evScore < 40 || loc.trafficVolume < 40) return 'Medium';
  return 'Low';
}

function calcRouteGapScore(loc) {
  // Score how underserved a location is for EV travel routes
  const coverageGap = 100 - (loc.routeCoverage || 0);
  return Math.round(coverageGap * 0.5 + loc.trafficVolume * 0.3 + loc.populationDensity * 0.2);
}

function generateAIInsight(loc, demandScore, priority) {
  const factors = [];
  if (loc.commercialScore >= 70) factors.push('high commercial activity');
  if (loc.trafficVolume >= 70) factors.push('heavy traffic density');
  if (loc.populationDensity >= 70) factors.push('dense population');
  if (loc.evScore >= 60) factors.push('strong EV adoption trends');
  if (loc.routeCoverage < 30) factors.push('significant route coverage gap');

  const factorStr = factors.length
    ? factors.join(', ')
    : 'moderate urban indicators';

  return `${loc.name} (${loc.city}) shows ${priority.toLowerCase()} charging demand (score: ${demandScore}) driven by ${factorStr}. ${
    priority === 'Critical' || priority === 'High'
      ? 'Immediate investment is recommended to capture early EV market share.'
      : 'Monitor growth trends before committing capital.'
  }`;
}

function scoreLocation(loc) {
  const demandScore = calcDemandScore(loc);
  const investmentScore = calcInvestmentScore(demandScore, loc);
  const chargersNeeded = calcChargersNeeded(demandScore);
  const estimatedROI = calcEstimatedROI(chargersNeeded, demandScore);
  const priority = getPriority(demandScore);
  const riskLevel = getRiskLevel(loc);
  const estimatedCost = chargersNeeded * CHARGER_COST_USD;
  const estimatedUtilization = Math.min(95, Math.round(demandScore * 0.85 + Math.random() * 5));
  const routeGapScore = calcRouteGapScore(loc);
  const paybackPeriodMonths = calcPaybackPeriod(chargersNeeded, demandScore);
  const aiInsight = generateAIInsight(loc, demandScore, priority);

  return {
    demandScore,
    investmentScore,
    priority,
    chargersNeeded,
    estimatedROI,
    estimatedCost,
    estimatedUtilization,
    routeGapScore,
    riskLevel,
    paybackPeriodMonths,
    aiInsight,
  };
}

module.exports = { scoreLocation, calcDemandScore, getPriority };
