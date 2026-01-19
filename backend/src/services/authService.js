import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (username, password, age, gender) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username }
  });

  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      age,
      gender
    },
    select: {
      id: true,
      username: true,
      age: true,
      gender: true
    }
  });

  return user;
};

export const loginUser = async (username, password) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      age: user.age,
      gender: user.gender
    }
  };
};


