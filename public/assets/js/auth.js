/**
 * SV Portfolio - Authentication Module
 * Handles login state and API communication
 */

// Auto-detect API URL based on environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const defaultApiUrl = isLocal ? 'http://localhost:3000' : 'https://sv-portfolio-api.onrender.com';
const API_BASE_URL = localStorage.getItem('sv_api_url') || defaultApiUrl;

// Check authentication
export function checkAuth() {
    const token = localStorage.getItem('sv_auth_token');
    const user = JSON.parse(localStorage.getItem('sv_user') || 'null');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return null;
    }
    
    return { token, user };
}

// Logout
export function logout() {
    localStorage.removeItem('sv_auth_token');
    localStorage.removeItem('sv_user');
    window.location.href = 'login.html';
}

// API Request wrapper with auth
export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('sv_auth_token');
    
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
        
        // Handle 401 (unauthorized)
        if (response.status === 401) {
            logout();
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request error:', error);
        throw error;
    }
}

// Portfolio API calls
export const portfolioAPI = {
    
    // Get all portfolios
    async getAll() {
        return await apiRequest('/api/portfolios');
    },
    
    // Get single portfolio
    async getOne(id) {
        return await apiRequest(`/api/portfolios/${id}`);
    },
    
    // Create portfolio
    async create(name, description = '') {
        return await apiRequest('/api/portfolios', {
            method: 'POST',
            body: JSON.stringify({ name, description })
        });
    },
    
    // Update portfolio
    async update(id, data) {
        return await apiRequest(`/api/portfolios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // Delete portfolio
    async delete(id) {
        return await apiRequest(`/api/portfolios/${id}`, {
            method: 'DELETE'
        });
    },
    
    // Add position
    async addPosition(portfolioId, position) {
        return await apiRequest(`/api/portfolios/${portfolioId}/positions`, {
            method: 'POST',
            body: JSON.stringify(position)
        });
    },
    
    // Update position
    async updatePosition(portfolioId, positionId, data) {
        return await apiRequest(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // Delete position
    async deletePosition(portfolioId, positionId) {
        return await apiRequest(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
            method: 'DELETE'
        });
    },
    
    // Bulk update prices
    async bulkUpdatePrices(portfolioId, updates) {
        return await apiRequest(`/api/portfolios/${portfolioId}/positions/bulk-update`, {
            method: 'POST',
            body: JSON.stringify({ updates })
        });
    }
};

// Settings API calls
export const settingsAPI = {
    
    // Get settings
    async get() {
        return await apiRequest('/api/settings');
    },
    
    // Update settings
    async update(settings) {
        return await apiRequest('/api/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },
    
    // Update API keys
    async updateApiKeys(keys) {
        return await apiRequest('/api/settings/api-keys', {
            method: 'PUT',
            body: JSON.stringify(keys)
        });
    }
};

// Initialize auth check on page load
if (window.location.pathname !== '/login.html' && !window.location.pathname.endsWith('login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const auth = checkAuth();
        if (auth) {
            // Display user info in UI
            const userDisplay = document.getElementById('user-display');
            if (userDisplay) {
                userDisplay.innerHTML = `
                    <span class="text-sm font-bold">${auth.user.name || auth.user.username}</span>
                    <button onclick="logout()" class="ml-2 text-xs text-rose-400 hover:text-rose-600">
                        <i class="fa-solid fa-right-from-bracket"></i> Salir
                    </button>
                `;
            }
        }
    });
}

// Make functions globally available
window.logout = logout;
window.checkAuth = checkAuth;
