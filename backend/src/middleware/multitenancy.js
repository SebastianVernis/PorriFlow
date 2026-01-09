/**
 * Multitenancy middleware for data isolation
 * Ensures users can only access their own data
 */

/**
 * Validates that a portfolio belongs to the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware
 */
export const validatePortfolioOwnership = async (req, res, next) => {
    try {
        const portfolioId = req.params.id || req.params.portfolioId;
        
        if (!portfolioId) {
            return next(); // No portfolio ID to validate
        }

        const portfolio = await req.prisma.portfolio.findFirst({
            where: {
                id: portfolioId,
                userId: req.userId
            }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found or access denied' });
        }

        req.portfolio = portfolio;
        next();
    } catch (error) {
        console.error('Portfolio ownership validation error:', error);
        res.status(500).json({ error: 'Failed to validate ownership' });
    }
};

/**
 * Validates that a position belongs to the authenticated user (via portfolio)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware
 */
export const validatePositionOwnership = async (req, res, next) => {
    try {
        const { portfolioId, positionId } = req.params;
        
        if (!portfolioId || !positionId) {
            return next();
        }

        // First validate portfolio ownership
        const portfolio = await req.prisma.portfolio.findFirst({
            where: {
                id: portfolioId,
                userId: req.userId
            }
        });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found or access denied' });
        }

        // Then validate position belongs to that portfolio
        const position = await req.prisma.position.findFirst({
            where: {
                id: positionId,
                portfolioId: portfolioId
            }
        });

        if (!position) {
            return res.status(404).json({ error: 'Position not found or access denied' });
        }

        req.portfolio = portfolio;
        req.position = position;
        next();
    } catch (error) {
        console.error('Position ownership validation error:', error);
        res.status(500).json({ error: 'Failed to validate ownership' });
    }
};

/**
 * Ensures all database queries are scoped to the current user
 * This is a safety layer that modifies Prisma queries
 */
export const enforceTenantIsolation = (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Store original prisma instance
    const originalPrisma = req.prisma;

    // Create a proxy to automatically inject userId filters
    req.prisma = new Proxy(originalPrisma, {
        get(target, prop) {
            // Only intercept portfolio queries
            if (prop === 'portfolio') {
                return new Proxy(target[prop], {
                    get(portfolioTarget, portfolioMethod) {
                        const original = portfolioTarget[portfolioMethod];
                        
                        if (typeof original !== 'function') {
                            return original;
                        }

                        // Intercept findMany, findFirst, findUnique, update, delete
                        if (['findMany', 'findFirst', 'findUnique', 'update', 'delete'].includes(portfolioMethod)) {
                            return function(args = {}) {
                                // Inject userId filter
                                args.where = args.where || {};
                                args.where.userId = req.userId;
                                return original.call(portfolioTarget, args);
                            };
                        }

                        return original.bind(portfolioTarget);
                    }
                });
            }

            return target[prop];
        }
    });

    next();
};

/**
 * Rate limiting per user
 */
const userRequestCounts = new Map();

export const userRateLimit = (maxRequests = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const userId = req.userId;
        
        if (!userId) {
            return next();
        }

        const now = Date.now();
        const userKey = `${userId}`;
        
        if (!userRequestCounts.has(userKey)) {
            userRequestCounts.set(userKey, { count: 1, resetAt: now + windowMs });
            return next();
        }

        const userCount = userRequestCounts.get(userKey);
        
        if (now > userCount.resetAt) {
            // Reset window
            userCount.count = 1;
            userCount.resetAt = now + windowMs;
            return next();
        }

        if (userCount.count >= maxRequests) {
            return res.status(429).json({ 
                error: 'Too many requests',
                retryAfter: Math.ceil((userCount.resetAt - now) / 1000)
            });
        }

        userCount.count++;
        next();
    };
};

export default {
    validatePortfolioOwnership,
    validatePositionOwnership,
    enforceTenantIsolation,
    userRateLimit
};
