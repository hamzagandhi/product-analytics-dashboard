import { getAnalytics } from '../services/analyticsService.js';

export const getAnalyticsData = async (req, res) => {
  try {
    const { startDate, endDate, ageRange, gender, feature } = req.query;

    const filters = {
      startDate: startDate || null,
      endDate: endDate || null,
      ageRange: ageRange || null,
      gender: gender || null,
      feature: feature || null
    };

    const analytics = await getAnalytics(filters);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


