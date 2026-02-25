const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'COUNSELOR'
            }
        });

        res.status(201).json({
            success: true,
            token: generateToken(user.id)
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.status === 'Inactive') {
            return res.status(403).json({ success: false, message: 'Account is deactivated' });
        }

        res.json({
            success: true,
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
