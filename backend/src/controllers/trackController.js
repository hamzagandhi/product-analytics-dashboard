import { trackFeatureClick } from '../services/trackService.js';

export const track = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user); 
    const { feature_name } = req.body;
    const userId = req.user.userId;

    if (!feature_name) {
      return res.status(400).json({ error: 'feature_name is required' });
    }

    await trackFeatureClick(userId, feature_name);
    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


