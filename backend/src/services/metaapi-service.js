/**
 * SV Portfolio - MetaAPI Core Service
 * Core integration with MetaAPI Cloud SDK for MetaTrader 4/5
 * 
 * @requires metaapi.cloud-sdk
 * @see https://metaapi.cloud/docs/client/
 */

import MetaApi from 'metaapi.cloud-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Singleton MetaAPI instance
let metaApiInstance = null;

/**
 * Initialize MetaAPI SDK with token
 * @param {string} token - MetaAPI API token
 * @returns {MetaApi} MetaAPI instance
 */
export function initializeMetaAPI(token) {
    if (!token) {
        throw new Error('MetaAPI token is required');
    }
    
    if (!metaApiInstance || metaApiInstance.token !== token) {
        metaApiInstance = new MetaApi(token);
        console.log('✅ MetaAPI SDK initialized');
    }
    
    return metaApiInstance;
}

/**
 * Get MetaAPI instance (must be initialized first)
 * @returns {MetaApi} MetaAPI instance
 */
export function getMetaAPIInstance() {
    if (!metaApiInstance) {
        throw new Error('MetaAPI not initialized. Call initializeMetaAPI() first.');
    }
    return metaApiInstance;
}

/**
 * Create a new MetaTrader account in MetaAPI
 * @param {Object} config - Account configuration
 * @param {string} config.name - Account name
 * @param {string} config.type - Account type ('cloud' or 'self-hosted')
 * @param {string} config.login - MT login
 * @param {string} config.password - MT password
 * @param {string} config.server - MT server
 * @param {string} config.platform - Platform ('mt4' or 'mt5')
 * @param {string} config.magic - Magic number (optional)
 * @returns {Promise<Object>} Created account
 */
export async function createAccount(config) {
    try {
        const api = getMetaAPIInstance();
        
        const accountData = {
            name: config.name,
            type: config.type || 'cloud',
            login: config.login,
            password: config.password,
            server: config.server,
            platform: config.platform,
            magic: config.magic || 0,
            application: 'SV Portfolio Manager',
            ...(config.type === 'cloud' && { 
                region: config.region || 'new-york'
            })
        };
        
        const account = await api.metatraderAccountApi.createAccount(accountData);
        
        console.log(`✅ MetaAPI account created: ${account.id}`);
        
        return {
            id: account.id,
            name: account.name,
            type: account.type,
            login: account.login,
            server: account.server,
            platform: account.platform,
            state: account.state,
            connectionStatus: account.connectionStatus
        };
    } catch (error) {
        console.error('❌ Error creating MetaAPI account:', error);
        throw new Error(`Failed to create account: ${error.message}`);
    }
}

/**
 * Get account details from MetaAPI
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<Object>} Account details
 */
export async function getAccount(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        return {
            id: account.id,
            name: account.name,
            type: account.type,
            login: account.login,
            server: account.server,
            platform: account.platform,
            state: account.state,
            connectionStatus: account.connectionStatus,
            region: account.region,
            createdAt: account.createdAt
        };
    } catch (error) {
        console.error(`❌ Error getting account ${accountId}:`, error);
        throw new Error(`Failed to get account: ${error.message}`);
    }
}

/**
 * Deploy MetaTrader account for trading
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<void>}
 */
export async function deployAccount(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        await account.deploy();
        
        console.log(`✅ Account ${accountId} deployed`);
        
        // Wait for deployment to complete
        await account.waitDeployed();
        
        console.log(`✅ Account ${accountId} deployment complete`);
    } catch (error) {
        console.error(`❌ Error deploying account ${accountId}:`, error);
        throw new Error(`Failed to deploy account: ${error.message}`);
    }
}

/**
 * Undeploy MetaTrader account
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<void>}
 */
export async function undeployAccount(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        await account.undeploy();
        
        console.log(`✅ Account ${accountId} undeployed`);
    } catch (error) {
        console.error(`❌ Error undeploying account ${accountId}:`, error);
        throw new Error(`Failed to undeploy account: ${error.message}`);
    }
}

/**
 * Test account connection
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<Object>} Connection test result
 */
export async function testConnection(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        // Check if account is deployed
        if (account.state !== 'DEPLOYED') {
            return {
                success: false,
                status: 'not_deployed',
                message: 'Account is not deployed'
            };
        }
        
        // Wait for connection
        const connection = account.getRPCConnection();
        await connection.connect();
        await connection.waitSynchronized();
        
        // Get account information to verify connection
        const accountInfo = await connection.getAccountInformation();
        
        return {
            success: true,
            status: 'connected',
            message: 'Connection successful',
            accountInfo: {
                balance: accountInfo.balance,
                equity: accountInfo.equity,
                margin: accountInfo.margin,
                freeMargin: accountInfo.freeMargin,
                leverage: accountInfo.leverage,
                currency: accountInfo.currency
            }
        };
    } catch (error) {
        console.error(`❌ Error testing connection for ${accountId}:`, error);
        return {
            success: false,
            status: 'error',
            message: error.message
        };
    }
}

/**
 * Get account information (balance, equity, margin, etc.)
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<Object>} Account information
 */
export async function getAccountInformation(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        const connection = account.getRPCConnection();
        await connection.connect();
        await connection.waitSynchronized();
        
        const accountInfo = await connection.getAccountInformation();
        
        return {
            balance: accountInfo.balance,
            equity: accountInfo.equity,
            margin: accountInfo.margin,
            freeMargin: accountInfo.freeMargin,
            marginLevel: accountInfo.marginLevel,
            leverage: accountInfo.leverage,
            currency: accountInfo.currency,
            name: accountInfo.name,
            server: accountInfo.server,
            credit: accountInfo.credit,
            tradeAllowed: accountInfo.tradeAllowed
        };
    } catch (error) {
        console.error(`❌ Error getting account information for ${accountId}:`, error);
        throw new Error(`Failed to get account information: ${error.message}`);
    }
}

/**
 * Get open positions
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<Array>} Array of positions
 */
export async function getPositions(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        const connection = account.getRPCConnection();
        await connection.connect();
        await connection.waitSynchronized();
        
        const positions = await connection.getPositions();
        
        return positions.map(pos => ({
            id: pos.id,
            ticket: pos.ticket || pos.id,
            symbol: pos.symbol,
            type: pos.type,
            volume: pos.volume,
            openPrice: pos.openPrice,
            currentPrice: pos.currentPrice,
            profit: pos.profit,
            swap: pos.swap,
            commission: pos.commission,
            stopLoss: pos.stopLoss,
            takeProfit: pos.takeProfit,
            openTime: pos.time,
            updateTime: pos.updateTime,
            comment: pos.comment,
            magicNumber: pos.magic
        }));
    } catch (error) {
        console.error(`❌ Error getting positions for ${accountId}:`, error);
        throw new Error(`Failed to get positions: ${error.message}`);
    }
}

/**
 * Get pending orders
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<Array>} Array of orders
 */
export async function getOrders(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        const connection = account.getRPCConnection();
        await connection.connect();
        await connection.waitSynchronized();
        
        const orders = await connection.getOrders();
        
        return orders.map(order => ({
            id: order.id,
            ticket: order.ticket || order.id,
            symbol: order.symbol,
            type: order.type,
            volume: order.volume,
            openPrice: order.openPrice,
            currentPrice: order.currentPrice,
            stopLoss: order.stopLoss,
            takeProfit: order.takeProfit,
            openTime: order.time,
            expirationTime: order.expirationTime,
            comment: order.comment,
            magicNumber: order.magic,
            state: order.state
        }));
    } catch (error) {
        console.error(`❌ Error getting orders for ${accountId}:`, error);
        throw new Error(`Failed to get orders: ${error.message}`);
    }
}

/**
 * Get historical trades
 * @param {string} accountId - MetaAPI account ID
 * @param {Object} options - Query options
 * @param {Date} options.startTime - Start time
 * @param {Date} options.endTime - End time
 * @param {number} options.offset - Pagination offset
 * @param {number} options.limit - Pagination limit
 * @returns {Promise<Array>} Array of historical deals
 */
export async function getHistory(accountId, options = {}) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        const connection = account.getRPCConnection();
        await connection.connect();
        await connection.waitSynchronized();
        
        const history = await connection.getHistoryOrdersByTimeRange(
            options.startTime || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default: last 30 days
            options.endTime || new Date(),
            options.offset || 0,
            options.limit || 1000
        );
        
        return history.historyOrders || [];
    } catch (error) {
        console.error(`❌ Error getting history for ${accountId}:`, error);
        throw new Error(`Failed to get history: ${error.message}`);
    }
}

/**
 * Delete account from MetaAPI
 * @param {string} accountId - MetaAPI account ID
 * @returns {Promise<void>}
 */
export async function deleteAccount(accountId) {
    try {
        const api = getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(accountId);
        
        await account.remove();
        
        console.log(`✅ Account ${accountId} deleted from MetaAPI`);
    } catch (error) {
        console.error(`❌ Error deleting account ${accountId}:`, error);
        throw new Error(`Failed to delete account: ${error.message}`);
    }
}

/**
 * Generate account-specific access token
 * @param {string} accountId - MetaAPI account ID
 * @param {number} validityHours - Token validity in hours (default: 24)
 * @returns {Promise<string>} Access token
 */
export async function generateAccountToken(accountId, validityHours = 24) {
    try {
        const api = getMetaAPIInstance();
        
        const token = await api.tokenManagementApi.narrowDownToken(
            {
                applications: [
                    'trading-account-management-api',
                    'metaapi-rest-api',
                    'metaapi-rpc-api',
                    'metaapi-real-time-streaming-api'
                ],
                roles: ['reader', 'trader'],
                resources: [{ entity: 'account', id: accountId }]
            },
            validityHours
        );
        
        console.log(`✅ Generated access token for account ${accountId}`);
        
        return token;
    } catch (error) {
        console.error(`❌ Error generating token for ${accountId}:`, error);
        throw new Error(`Failed to generate token: ${error.message}`);
    }
}

export default {
    initializeMetaAPI,
    getMetaAPIInstance,
    createAccount,
    getAccount,
    deployAccount,
    undeployAccount,
    testConnection,
    getAccountInformation,
    getPositions,
    getOrders,
    getHistory,
    deleteAccount,
    generateAccountToken
};
