import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ----------------------
// Constants (must match frontend)
// ----------------------
const FEATURES = [
  "date_filter",
  "age_filter",
  "gender_filter",
  "bar_chart_click"
];

const USERS = [
  { username: "teen_male", age: 16, gender: "Male" },
  { username: "teen_female", age: 17, gender: "Female" },

  { username: "adult_male", age: 25, gender: "Male" },
  { username: "adult_female", age: 30, gender: "Female" },

  { username: "senior_male", age: 50, gender: "Male" },
  { username: "senior_female", age: 55, gender: "Female" },

  { username: "other_young", age: 22, gender: "Other" },
  { username: "other_old", age: 45, gender: "Other" }
];

// ----------------------
// Helpers
// ----------------------
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// ----------------------
// Seed Logic
// ----------------------
async function main() {
  console.log("Seeding database...");

  await prisma.featureClick.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // Create deterministic users (guarantees all filters work)
  const createdUsers = [];
  for (const u of USERS) {
    const user = await prisma.user.create({
      data: {
        username: u.username,
        password,
        age: u.age,
        gender: u.gender
      }
    });
    createdUsers.push(user);
  }

  console.log(`Created ${createdUsers.length} users`);

  // Create realistic analytics data
  const clicks = [];

  // For each user, generate clicks across last 30 days
  for (const user of createdUsers) {
    for (let day = 0; day < 30; day++) {
      const eventsToday = Math.floor(Math.random() * 4) + 2; // 2–5 events/day

      for (let i = 0; i < eventsToday; i++) {
        clicks.push({
          user_id: user.id,
          feature_name: randomItem(FEATURES),
          timestamp: daysAgo(day)
        });
      }
    }
  }

  // Bulk insert
  await prisma.featureClick.createMany({
    data: clicks
  });

  console.log(`Created ${clicks.length} feature clicks`);
  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
