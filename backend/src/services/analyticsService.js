import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to normalize start of day
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Helper function to normalize end of day
const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getAnalytics = async (filters) => {
  const { startDate, endDate, ageRange, gender, feature } = filters;

  // ----------------------------
  // Build user filters
  // ----------------------------
  const userWhere = {};

  if (gender) {
    userWhere.gender = gender;
  }

  if (ageRange) {
    if (ageRange === '<18') {
      userWhere.age = { lt: 18 };
    } else if (ageRange === '18-40') {
      userWhere.age = { gte: 18, lte: 40 };
    } else if (ageRange === '>40') {
      userWhere.age = { gt: 40 };
    }
  }

  // ----------------------------
  // Build base where for clicks
  // ----------------------------
  const baseWhere = {};

  if (startDate || endDate) {
    baseWhere.timestamp = {};
    if (startDate) baseWhere.timestamp.gte = startOfDay(startDate);
    if (endDate) baseWhere.timestamp.lte = endOfDay(endDate);
  }

  if (Object.keys(userWhere).length > 0) {
    baseWhere.user = { is: userWhere };
  }

  // ----------------------------
  // BAR CHART: clicks per feature
  // ----------------------------
  const barChartData = await prisma.featureClick.groupBy({
    by: ['feature_name'],
    where: baseWhere,
    _count: { id: true },
    orderBy: {
      _count: { id: 'desc' }
    }
  });

  const barChart = barChartData.map(item => ({
    feature_name: item.feature_name,
    total_clicks: item._count.id
  }));

  // ----------------------------
  // LINE CHART: clicks over time
  // ----------------------------
  const lineWhere = { ...baseWhere };

  if (feature) {
    lineWhere.feature_name = feature;
  }

  const lineChartRaw = await prisma.featureClick.findMany({
    where: lineWhere,
    select: {
      timestamp: true
    },
    orderBy: {
      timestamp: 'asc'
    }
  });

  // Group by day (stable grouping)
  const grouped = {};

  for (const row of lineChartRaw) {
    const key = startOfDay(row.timestamp).toISOString();
    grouped[key] = (grouped[key] || 0) + 1;
  }

  const lineChart = Object.entries(grouped).map(([date, count]) => ({
    date,
    click_count: count
  }));

  // ----------------------------
  // Final response
  // ----------------------------
  return {
    barChart,
    lineChart
  };
};

