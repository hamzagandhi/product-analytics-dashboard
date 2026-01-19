import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { username, password, age, gender } = req.body;

    if (!username || !password || !age || !gender) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender value' });
    }

    const user = await registerUser(username, password, age, gender);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error.message === 'Username already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await loginUser(username, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};


