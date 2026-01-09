/**
 * API Client for SV Portfolio
 * Handles all backend communication
 */

// Auto-detect API URL based on environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const defaultApiUrl = isLocal ? 'http://localhost:3000' : 'https://sv-portfolio-api.onrender.com';
const API_BASE_URL = localStorage.getItem('sv_api_url') || defaultApiUrl;

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('sv_auth_token');
    
    if (!token && !endpoint.startsWith('/api/auth/')) {
        throw new Error('No authentication token');
    }

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('sv_auth_token');
            localStorage.removeItem('sv_user');
            window.location.href = '/login.html';
            throw new Error('Session expired');
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ====== PORTFOLIO ENDPOINTS ======

/**
 * Get all portfolios for current user
 */
export async function getPortfolios() {
    const data = await apiRequest('/api/portfolios');
    return data.portfolios;
}

/**
 * Get single portfolio by ID
 */
export async function getPortfolio(portfolioId) {
    const data = await apiRequest(`/api/portfolios/${portfolioId}`);
    return data.portfolio;
}

/**
 * Create new portfolio
 */
export async function createPortfolio(name, description = '') {
    const data = await apiRequest('/api/portfolios', {
        method: 'POST',
        body: JSON.stringify({ name, description })
    });
    return data.portfolio;
}

/**
 * Update portfolio
 */
export async function updatePortfolio(portfolioId, updates) {
    await apiRequest(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
}

/**
 * Delete portfolio
 */
export async function deletePortfolio(portfolioId) {
    await apiRequest(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE'
    });
}

// ====== POSITION ENDPOINTS ======

/**
 * Add position to portfolio
 */
export async function addPosition(portfolioId, position) {
    const data = await apiRequest(`/api/portfolios/${portfolioId}/positions`, {
        method: 'POST',
        body: JSON.stringify(position)
    });
    return data.position;
}

/**
 * Update position
 */
export async function updatePosition(portfolioId, positionId, updates) {
    await apiRequest(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
}

/**
 * Delete position
 */
export async function deletePosition(portfolioId, positionId) {
    await apiRequest(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
        method: 'DELETE'
    });
}

/**
 * Bulk update positions (for price refresh)
 */
export async function bulkUpdatePositions(portfolioId, updates) {
    await apiRequest(`/api/portfolios/${portfolioId}/positions/bulk-update`, {
        method: 'POST',
        body: JSON.stringify({ updates })
    });
}

// ====== SETTINGS ENDPOINTS ======

/**
 * Get user settings
 */
export async function getSettings() {
    const data = await apiRequest('/api/settings');
    return data.settings;
}

/**
 * Update user settings
 */
export async function updateSettings(settings) {
    await apiRequest('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
    });
}

// ====== MARKET DATA ENDPOINTS ======

/**
 * Get current prices for symbols
 */
export async function getCurrentPrices(symbols) {
    const params = new URLSearchParams({ symbols: symbols.join(',') });
    const data = await apiRequest(`/api/market-data/prices?${params}`);
    return data.prices;
}

/**
 * Get historical data for symbol
 */
export async function getHistoricalData(symbol, days = 30) {
    const params = new URLSearchParams({ symbol, days });
    const data = await apiRequest(`/api/market-data/historical?${params}`);
    return data.historical;
}

// ====== NEWS ENDPOINTS ======

/**
 * Get news for symbols
 */
export async function getNews(symbols, limit = 10) {
    const params = new URLSearchParams({ 
        symbols: symbols.join(','),
        limit 
    });
    const data = await apiRequest(`/api/news?${params}`);
    return data.news;
}

/**
 * Get news sentiment for symbol
 */
export async function getNewsSentiment(symbol) {
    const data = await apiRequest(`/api/news/sentiment/${symbol}`);
    return data.sentiment;
}

// ====== HELPER FUNCTIONS ======

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!localStorage.getItem('sv_auth_token');
}

/**
 * Get current user info
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('sv_user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout user
 */
export function logout() {
    localStorage.removeItem('sv_auth_token');
    localStorage.removeItem('sv_user');
    window.location.href = '/login.html';
}

// ====== MIGRATION HELPERS ======

/**
 * Migrate localStorage portfolios to API
 */
export async function migrateLocalStorageToAPI() {
    try {
        // Get old localStorage data
        const oldPortfolios = JSON.parse(localStorage.getItem('sv_portfolios_unified'));
        
        if (!oldPortfolios || Object.keys(oldPortfolios).length === 0) {
            console.log('No portfolios to migrate');
            return;
        }

        console.log('🔄 Migrating portfolios to API...');
        
        // Get existing portfolios from API
        const existingPortfolios = await getPortfolios();
        
        // If user already has portfolios, skip migration
        if (existingPortfolios.length > 0) {
            console.log('✅ User already has portfolios in API');
            return;
        }

        // Migrate each portfolio
        for (const [oldId, portfolioData] of Object.entries(oldPortfolios)) {
            const newPortfolio = await createPortfolio(
                portfolioData.name || 'Portfolio',
                portfolioData.description || ''
            );

            // Migrate positions
            if (portfolioData.positions && portfolioData.positions.length > 0) {
                for (const position of portfolioData.positions) {
                    await addPosition(newPortfolio.id, {
                        ticker: position.ticker,
                        name: position.name,
                        sector: position.sector,
                        shares: position.shares || 0,
                        avgCost: position.avgCost || 0,
                        currentPrice: position.currentPrice || position.avgCost || 0,
                        beta: position.beta || 1.0,
                        dgr: position.dgr || 0,
                        dividendYield: position.dividendYield || 0,
                        isCrypto: position.isCrypto || false
                    });
                }
            }

            console.log(`✅ Migrated portfolio: ${portfolioData.name}`);
        }

        // Migrate settings
        const oldSettings = JSON.parse(localStorage.getItem('sv_global_settings'));
        if (oldSettings) {
            await updateSettings({
                riskFreeRate: oldSettings.riskFreeRate || 4.5,
                marketVolatility: oldSettings.marketVolatility || 15,
                annualTarget: oldSettings.annualTarget || 20,
                refreshInterval: oldSettings.refreshInterval || 5
            });
            console.log('✅ Settings migrated');
        }

        console.log('🎉 Migration complete!');
        
        // Backup old data
        localStorage.setItem('sv_portfolios_backup', localStorage.getItem('sv_portfolios_unified'));
        localStorage.setItem('sv_settings_backup', localStorage.getItem('sv_global_settings'));
        
        // Clear old data
        localStorage.removeItem('sv_portfolios_unified');
        localStorage.removeItem('sv_global_settings');
        localStorage.removeItem('sv_dividend_portfolio');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Export API_BASE_URL for direct usage
export { API_BASE_URL };
