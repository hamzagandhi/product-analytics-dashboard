import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const trackFeatureClick = async (userId, featureName) => {
  const click = await prisma.featureClick.create({
    data: {
      user_id: userId,
      feature_name: featureName,
      timestamp: new Date()
    }
  });

  return click;
};


