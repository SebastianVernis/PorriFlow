/**
 * SV Portfolio - MetaAPI Synchronization Service
 * Handles synchronization of positions, orders, and account data
 * between MetaTrader and the database
 */

import { PrismaClient } from '@prisma/client';
import metaapiService from './metaapi-service.js';

const prisma = new PrismaClient();

/**
 * Sync all positions for an MT account
 * @param {string} mtAccountId - Database MT account ID
 * @returns {Promise<Object>} Sync result
 */
export async function syncPositions(mtAccountId) {
    const startTime = Date.now();
    
    try {
        // Get MT account from database
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        if (!mtAccount.syncEnabled) {
            return {
                success: false,
                message: 'Sync is disabled for this account'
            };
        }
        
        // Fetch positions from MetaAPI
        const positions = await metaapiService.getPositions(mtAccount.metaapiAccountId);
        
        let synced = 0;
        let failed = 0;
        const errors = [];
        
        // Get existing positions from database
        const existingPositions = await prisma.mTPosition.findMany({
            where: { mtAccountId }
        });
        
        const existingPositionIds = new Set(existingPositions.map(p => p.positionId));
        const currentPositionIds = new Set(positions.map(p => p.id));
        
        // Create or update positions
        for (const position of positions) {
            try {
                await prisma.mTPosition.upsert({
                    where: {
                        mtAccountId_positionId: {
                            mtAccountId,
                            positionId: position.id
                        }
                    },
                    create: {
                        mtAccountId,
                        userId: mtAccount.userId,
                        positionId: position.id,
                        ticket: position.ticket,
                        symbol: position.symbol,
                        type: position.type,
                        volume: position.volume,
                        openPrice: position.openPrice,
                        currentPrice: position.currentPrice,
                        profit: position.profit,
                        swap: position.swap,
                        commission: position.commission,
                        stopLoss: position.stopLoss,
                        takeProfit: position.takeProfit,
                        openTime: position.openTime,
                        updateTime: position.updateTime,
                        comment: position.comment,
                        magicNumber: position.magicNumber,
                        isSynced: true,
                        lastSyncAt: new Date()
                    },
                    update: {
                        currentPrice: position.currentPrice,
                        profit: position.profit,
                        swap: position.swap,
                        commission: position.commission,
                        stopLoss: position.stopLoss,
                        takeProfit: position.takeProfit,
                        updateTime: position.updateTime,
                        isSynced: true,
                        lastSyncAt: new Date()
                    }
                });
                
                synced++;
            } catch (error) {
                console.error(`Error syncing position ${position.id}:`, error);
                failed++;
                errors.push(`Position ${position.id}: ${error.message}`);
            }
        }
        
        // Delete positions that no longer exist in MT
        const positionsToDelete = [...existingPositionIds].filter(
            id => !currentPositionIds.has(id)
        );
        
        if (positionsToDelete.length > 0) {
            await prisma.mTPosition.deleteMany({
                where: {
                    mtAccountId,
                    positionId: { in: positionsToDelete }
                }
            });
            
            console.log(`🗑️ Deleted ${positionsToDelete.length} closed positions`);
        }
        
        // Update last sync time
        await prisma.mTAccount.update({
            where: { id: mtAccountId },
            data: { lastSyncAt: new Date() }
        });
        
        // Log sync result
        const duration = Date.now() - startTime;
        await logSyncResult(mtAccountId, {
            syncType: 'positions',
            status: failed === 0 ? 'success' : 'partial',
            itemsSynced: synced,
            itemsFailed: failed,
            errorMessage: errors.length > 0 ? errors.join('; ') : null,
            durationMs: duration
        });
        
        return {
            success: true,
            synced,
            failed,
            deleted: positionsToDelete.length,
            duration,
            errors: errors.length > 0 ? errors : null
        };
        
    } catch (error) {
        console.error(`❌ Error syncing positions for ${mtAccountId}:`, error);
        
        const duration = Date.now() - startTime;
        await logSyncResult(mtAccountId, {
            syncType: 'positions',
            status: 'error',
            itemsSynced: 0,
            itemsFailed: 0,
            errorMessage: error.message,
            durationMs: duration
        });
        
        throw error;
    }
}

/**
 * Sync all orders for an MT account
 * @param {string} mtAccountId - Database MT account ID
 * @returns {Promise<Object>} Sync result
 */
export async function syncOrders(mtAccountId) {
    const startTime = Date.now();
    
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        // Fetch orders from MetaAPI
        const orders = await metaapiService.getOrders(mtAccount.metaapiAccountId);
        
        let synced = 0;
        let failed = 0;
        const errors = [];
        
        // Get existing orders from database
        const existingOrders = await prisma.mTOrder.findMany({
            where: { 
                mtAccountId,
                state: 'pending'
            }
        });
        
        const existingOrderIds = new Set(existingOrders.map(o => o.orderId));
        const currentOrderIds = new Set(orders.map(o => o.id));
        
        // Create or update orders
        for (const order of orders) {
            try {
                await prisma.mTOrder.upsert({
                    where: {
                        mtAccountId_orderId: {
                            mtAccountId,
                            orderId: order.id
                        }
                    },
                    create: {
                        mtAccountId,
                        userId: mtAccount.userId,
                        orderId: order.id,
                        ticket: order.ticket,
                        symbol: order.symbol,
                        type: order.type,
                        volume: order.volume,
                        openPrice: order.openPrice,
                        currentPrice: order.currentPrice,
                        stopLoss: order.stopLoss,
                        takeProfit: order.takeProfit,
                        openTime: order.openTime,
                        expirationTime: order.expirationTime,
                        comment: order.comment,
                        magicNumber: order.magicNumber,
                        state: order.state || 'pending'
                    },
                    update: {
                        currentPrice: order.currentPrice,
                        stopLoss: order.stopLoss,
                        takeProfit: order.takeProfit,
                        state: order.state || 'pending'
                    }
                });
                
                synced++;
            } catch (error) {
                console.error(`Error syncing order ${order.id}:`, error);
                failed++;
                errors.push(`Order ${order.id}: ${error.message}`);
            }
        }
        
        // Mark orders as cancelled if they no longer exist
        const ordersToCancel = [...existingOrderIds].filter(
            id => !currentOrderIds.has(id)
        );
        
        if (ordersToCancel.length > 0) {
            await prisma.mTOrder.updateMany({
                where: {
                    mtAccountId,
                    orderId: { in: ordersToCancel }
                },
                data: { 
                    state: 'cancelled',
                    closeTime: new Date()
                }
            });
            
            console.log(`🗑️ Marked ${ordersToCancel.length} orders as cancelled`);
        }
        
        const duration = Date.now() - startTime;
        await logSyncResult(mtAccountId, {
            syncType: 'orders',
            status: failed === 0 ? 'success' : 'partial',
            itemsSynced: synced,
            itemsFailed: failed,
            errorMessage: errors.length > 0 ? errors.join('; ') : null,
            durationMs: duration
        });
        
        return {
            success: true,
            synced,
            failed,
            cancelled: ordersToCancel.length,
            duration,
            errors: errors.length > 0 ? errors : null
        };
        
    } catch (error) {
        console.error(`❌ Error syncing orders for ${mtAccountId}:`, error);
        
        const duration = Date.now() - startTime;
        await logSyncResult(mtAccountId, {
            syncType: 'orders',
            status: 'error',
            itemsSynced: 0,
            itemsFailed: 0,
            errorMessage: error.message,
            durationMs: duration
        });
        
        throw error;
    }
}

/**
 * Sync account information (balance, equity, margin)
 * @param {string} mtAccountId - Database MT account ID
 * @returns {Promise<Object>} Sync result
 */
export async function syncAccountInfo(mtAccountId) {
    const startTime = Date.now();
    
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        // Fetch account info from MetaAPI
        const accountInfo = await metaapiService.getAccountInformation(mtAccount.metaapiAccountId);
        
        // Update database
        await prisma.mTAccount.update({
            where: { id: mtAccountId },
            data: {
                accountBalance: accountInfo.balance,
                accountEquity: accountInfo.equity,
                accountMargin: accountInfo.margin,
                accountFreeMargin: accountInfo.freeMargin,
                marginLevel: accountInfo.marginLevel,
                leverage: accountInfo.leverage,
                currency: accountInfo.currency,
                lastSyncAt: new Date()
            }
        });
        
        const duration = Date.now() - startTime;
        await logSyncResult(mtAccountId, {
            syncType: 'account_info',
            status: 'success',
            itemsSynced: 1,
            itemsFailed: 0,
            durationMs: duration
        });
        
        return {
            success: true,
            accountInfo,
            duration
        };
        
    } catch (error) {
        console.error(`❌ Error syncing account info for ${mtAccountId}:`, error);
        
        const duration = Date.now() - startTime;
        await logSyncResult(mtAccountId, {
            syncType: 'account_info',
            status: 'error',
            itemsSynced: 0,
            itemsFailed: 1,
            errorMessage: error.message,
            durationMs: duration
        });
        
        throw error;
    }
}

/**
 * Full synchronization (positions + orders + account info)
 * @param {string} mtAccountId - Database MT account ID
 * @returns {Promise<Object>} Sync result
 */
export async function fullSync(mtAccountId) {
    const startTime = Date.now();
    
    try {
        console.log(`🔄 Starting full sync for account ${mtAccountId}`);
        
        const results = {
            accountInfo: null,
            positions: null,
            orders: null
        };
        
        // Sync account info first
        try {
            results.accountInfo = await syncAccountInfo(mtAccountId);
        } catch (error) {
            console.error('Account info sync failed:', error);
            results.accountInfo = { success: false, error: error.message };
        }
        
        // Sync positions
        try {
            results.positions = await syncPositions(mtAccountId);
        } catch (error) {
            console.error('Positions sync failed:', error);
            results.positions = { success: false, error: error.message };
        }
        
        // Sync orders
        try {
            results.orders = await syncOrders(mtAccountId);
        } catch (error) {
            console.error('Orders sync failed:', error);
            results.orders = { success: false, error: error.message };
        }
        
        const duration = Date.now() - startTime;
        const allSuccess = results.accountInfo?.success && 
                          results.positions?.success && 
                          results.orders?.success;
        
        await logSyncResult(mtAccountId, {
            syncType: 'full',
            status: allSuccess ? 'success' : 'partial',
            itemsSynced: (results.positions?.synced || 0) + (results.orders?.synced || 0),
            itemsFailed: (results.positions?.failed || 0) + (results.orders?.failed || 0),
            durationMs: duration
        });
        
        console.log(`✅ Full sync completed in ${duration}ms`);
        
        return {
            success: allSuccess,
            duration,
            results
        };
        
    } catch (error) {
        console.error(`❌ Error in full sync for ${mtAccountId}:`, error);
        throw error;
    }
}

/**
 * Sync positions to a specific portfolio
 * @param {string} mtAccountId - Database MT account ID
 * @param {string} portfolioId - Portfolio ID to sync to
 * @returns {Promise<Object>} Sync result
 */
export async function syncToPortfolio(mtAccountId, portfolioId) {
    try {
        // First sync positions from MT
        await syncPositions(mtAccountId);
        
        // Get all positions for this MT account
        const mtPositions = await prisma.mTPosition.findMany({
            where: { mtAccountId }
        });
        
        // Link positions to portfolio
        await prisma.mTPosition.updateMany({
            where: { mtAccountId },
            data: { portfolioId }
        });
        
        // Create or update corresponding Position records in the portfolio
        let created = 0;
        let updated = 0;
        
        for (const mtPos of mtPositions) {
            const existingPosition = await prisma.position.findFirst({
                where: {
                    portfolioId,
                    ticker: mtPos.symbol
                }
            });
            
            if (existingPosition) {
                // Update existing position
                await prisma.position.update({
                    where: { id: existingPosition.id },
                    data: {
                        shares: mtPos.volume,
                        avgCost: mtPos.openPrice,
                        currentPrice: mtPos.currentPrice || mtPos.openPrice
                    }
                });
                updated++;
            } else {
                // Create new position
                await prisma.position.create({
                    data: {
                        portfolioId,
                        ticker: mtPos.symbol,
                        name: mtPos.symbol,
                        sector: 'Forex/CFD',
                        isCrypto: false,
                        shares: mtPos.volume,
                        avgCost: mtPos.openPrice,
                        currentPrice: mtPos.currentPrice || mtPos.openPrice
                    }
                });
                created++;
            }
        }
        
        return {
            success: true,
            linked: mtPositions.length,
            created,
            updated
        };
        
    } catch (error) {
        console.error(`❌ Error syncing to portfolio:`, error);
        throw error;
    }
}

/**
 * Log sync operation result
 * @param {string} mtAccountId - Database MT account ID
 * @param {Object} result - Sync result
 * @returns {Promise<void>}
 */
export async function logSyncResult(mtAccountId, result) {
    try {
        await prisma.mTSyncLog.create({
            data: {
                mtAccountId,
                syncType: result.syncType,
                status: result.status,
                itemsSynced: result.itemsSynced || 0,
                itemsFailed: result.itemsFailed || 0,
                errorMessage: result.errorMessage,
                errorDetails: result.errorDetails,
                durationMs: result.durationMs
            }
        });
    } catch (error) {
        console.error('Error logging sync result:', error);
    }
}

/**
 * Get sync logs for an account
 * @param {string} mtAccountId - Database MT account ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Sync logs
 */
export async function getSyncLogs(mtAccountId, options = {}) {
    const { limit = 50, syncType, status } = options;
    
    return await prisma.mTSyncLog.findMany({
        where: {
            mtAccountId,
            ...(syncType && { syncType }),
            ...(status && { status })
        },
        orderBy: { syncedAt: 'desc' },
        take: limit
    });
}

export default {
    syncPositions,
    syncOrders,
    syncAccountInfo,
    fullSync,
    syncToPortfolio,
    logSyncResult,
    getSyncLogs
};
