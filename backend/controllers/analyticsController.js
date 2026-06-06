const Location = require('../models/Location');
const Recommendation = require('../models/Recommendation');

exports.getAnalytics = async (req, res, next) => {
  try {
    const [locations, recommendations] = await Promise.all([
      Location.find(),
      Recommendation.find().populate('locationId'),
    ]);

    const totalLocations = locations.length;
    const recommendedStations = recommendations.length;
    const highDemandZones = recommendations.filter((r) => r.demandScore >= 70).length;
    const avgDemandScore =
      recommendations.length
        ? Math.round(
            recommendations.reduce((s, r) => s + r.demandScore, 0) / recommendations.length
          )
        : 0;
    const avgUtilization =
      recommendations.length
        ? Math.round(
            recommendations.reduce((s, r) => s + (r.estimatedUtilization || 0), 0) /
              recommendations.length
          )
        : 0;

    // City breakdown
    const cityMap = {};
    recommendations.forEach((r) => {
      if (!r.locationId) return;
      const city = r.locationId.city;
      if (!cityMap[city]) cityMap[city] = { city, totalDemand: 0, count: 0, totalInvestment: 0 };
      cityMap[city].totalDemand += r.demandScore;
      cityMap[city].count += 1;
      cityMap[city].totalInvestment += r.estimatedCost || 0;
    });

    const cityBreakdown = Object.values(cityMap).map((c) => ({
      city: c.city,
      avgDemand: Math.round(c.totalDemand / c.count),
      stationCount: c.count,
      totalInvestment: c.totalInvestment,
    }));

    // Investment ranking — top 10
    const investmentRanking = recommendations
      .filter((r) => r.locationId)
      .sort((a, b) => b.investmentScore - a.investmentScore)
      .slice(0, 10)
      .map((r) => ({
        name: r.locationId.name,
        city: r.locationId.city,
        investmentScore: r.investmentScore,
        demandScore: r.demandScore,
        estimatedROI: r.estimatedROI,
        chargersNeeded: r.chargersNeeded,
        estimatedCost: r.estimatedCost,
        paybackPeriodMonths: r.paybackPeriodMonths,
        priority: r.priority,
      }));

    // Utilization forecast — 12-month projection
    const forecastData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleString(
        'default',
        { month: 'short', year: '2-digit' }
      );
      return {
        month,
        utilization: Math.min(95, avgUtilization + i * 2 + Math.round(Math.random() * 3)),
        demandGrowth: Math.round(avgDemandScore * (1 + i * 0.03)),
        newStations: Math.round(highDemandZones * (1 + i * 0.1)),
      };
    });

    // Priority distribution
    const priorityDist = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    recommendations.forEach((r) => { if (r.priority) priorityDist[r.priority]++; });

    res.json({
      success: true,
      data: {
        summary: {
          totalLocations,
          recommendedStations,
          highDemandZones,
          avgDemandScore,
          avgUtilization,
          totalEstimatedInvestment: recommendations.reduce((s, r) => s + (r.estimatedCost || 0), 0),
        },
        cityBreakdown,
        investmentRanking,
        forecastData,
        priorityDistribution: Object.entries(priorityDist).map(([priority, count]) => ({
          priority,
          count,
        })),
        topInsights: recommendations
          .filter((r) => r.aiInsight && r.priority !== 'Low')
          .sort((a, b) => b.demandScore - a.demandScore)
          .slice(0, 6)
          .map((r) => ({
            location: r.locationId?.name,
            city: r.locationId?.city,
            insight: r.aiInsight,
            demandScore: r.demandScore,
            priority: r.priority,
            riskLevel: r.riskLevel,
          })),
      },
    });
  } catch (err) {
    next(err);
  }
};
