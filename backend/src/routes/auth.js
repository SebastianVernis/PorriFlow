import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, username, password, name } = req.body;

        // Validation
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Email, username and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase() },
                    { username: username.toLowerCase() }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with default portfolio and settings
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                username: username.toLowerCase(),
                password: hashedPassword,
                name: name || username,
                portfolios: {
                    create: {
                        name: 'Portafolio Principal',
                        isDefault: true
                    }
                },
                settings: {
                    create: {
                        riskFreeRate: 4.5,
                        marketVolatility: 15.0,
                        annualTarget: 20.0,
                        refreshInterval: 5,
                        currency: 'USD'
                    }
                }
            },
            include: {
                portfolios: true,
                settings: true
            }
        });

        // Generate token
        const token = generateToken(user.id, user.email);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user by username or email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username.toLowerCase() },
                    { email: username.toLowerCase() }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user.id, user.email);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
