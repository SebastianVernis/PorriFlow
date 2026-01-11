/**
 * SV Portfolio - MetaAPI Trading Service
 * Handles trading operations: placing orders, modifying positions, closing trades
 */

import { PrismaClient } from '@prisma/client';
import metaapiService from './metaapi-service.js';

const prisma = new PrismaClient();

/**
 * Place a market order
 * @param {string} mtAccountId - Database MT account ID
 * @param {Object} params - Order parameters
 * @param {string} params.symbol - Trading symbol (e.g., 'EURUSD')
 * @param {string} params.actionType - 'ORDER_TYPE_BUY' or 'ORDER_TYPE_SELL'
 * @param {number} params.volume - Trade volume (lots)
 * @param {number} params.stopLoss - Stop loss price (optional)
 * @param {number} params.takeProfit - Take profit price (optional)
 * @param {string} params.comment - Order comment (optional)
 * @param {number} params.magicNumber - Magic number (optional)
 * @returns {Promise<Object>} Trade result
 */
export async function placeMarketOrder(mtAccountId, params) {
    try {
        // Get MT account
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        if (mtAccount.status !== 'connected') {
            throw new Error('MT account is not connected');
        }
        
        // Validate parameters
        if (!params.symbol || !params.actionType || !params.volume) {
            throw new Error('Symbol, actionType, and volume are required');
        }
        
        if (params.volume <= 0) {
            throw new Error('Volume must be greater than 0');
        }
        
        // Get MetaAPI connection
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        // Prepare trade request
        const tradeRequest = {
            actionType: params.actionType,
            symbol: params.symbol,
            volume: params.volume,
            ...(params.stopLoss && { stopLoss: params.stopLoss }),
            ...(params.takeProfit && { takeProfit: params.takeProfit }),
            ...(params.comment && { comment: params.comment }),
            ...(params.magicNumber && { magic: params.magicNumber })
        };
        
        console.log(`📊 Placing market order:`, tradeRequest);
        
        // Execute trade
        const result = await connection.createMarketBuyOrder(
            params.symbol,
            params.volume,
            params.stopLoss,
            params.takeProfit,
            {
                comment: params.comment || 'SV Portfolio',
                magic: params.magicNumber || 0
            }
        );
        
        console.log(`✅ Market order placed:`, result);
        
        return {
            success: true,
            orderId: result.orderId,
            positionId: result.positionId,
            stringCode: result.stringCode,
            message: result.message
        };
        
    } catch (error) {
        console.error(`❌ Error placing market order:`, error);
        throw new Error(`Failed to place order: ${error.message}`);
    }
}

/**
 * Place a pending order
 * @param {string} mtAccountId - Database MT account ID
 * @param {Object} params - Order parameters
 * @param {string} params.symbol - Trading symbol
 * @param {string} params.actionType - Order type (BUY_LIMIT, SELL_LIMIT, BUY_STOP, SELL_STOP)
 * @param {number} params.volume - Trade volume
 * @param {number} params.openPrice - Order open price
 * @param {number} params.stopLoss - Stop loss price (optional)
 * @param {number} params.takeProfit - Take profit price (optional)
 * @param {Date} params.expirationTime - Order expiration (optional)
 * @param {string} params.comment - Order comment (optional)
 * @param {number} params.magicNumber - Magic number (optional)
 * @returns {Promise<Object>} Order result
 */
export async function placePendingOrder(mtAccountId, params) {
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        // Validate parameters
        if (!params.symbol || !params.actionType || !params.volume || !params.openPrice) {
            throw new Error('Symbol, actionType, volume, and openPrice are required');
        }
        
        // Get MetaAPI connection
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        // Prepare order request
        const orderRequest = {
            actionType: params.actionType,
            symbol: params.symbol,
            volume: params.volume,
            openPrice: params.openPrice,
            ...(params.stopLoss && { stopLoss: params.stopLoss }),
            ...(params.takeProfit && { takeProfit: params.takeProfit }),
            ...(params.expirationTime && { expiration: params.expirationTime }),
            ...(params.comment && { comment: params.comment }),
            ...(params.magicNumber && { magic: params.magicNumber })
        };
        
        console.log(`📊 Placing pending order:`, orderRequest);
        
        // Execute order
        const result = await connection.createLimitBuyOrder(
            params.symbol,
            params.volume,
            params.openPrice,
            params.stopLoss,
            params.takeProfit,
            {
                comment: params.comment || 'SV Portfolio',
                magic: params.magicNumber || 0,
                expiration: params.expirationTime
            }
        );
        
        console.log(`✅ Pending order placed:`, result);
        
        return {
            success: true,
            orderId: result.orderId,
            stringCode: result.stringCode,
            message: result.message
        };
        
    } catch (error) {
        console.error(`❌ Error placing pending order:`, error);
        throw new Error(`Failed to place pending order: ${error.message}`);
    }
}

/**
 * Modify an existing position (change SL/TP)
 * @param {string} mtAccountId - Database MT account ID
 * @param {string} positionId - Position ID
 * @param {Object} params - Modification parameters
 * @param {number} params.stopLoss - New stop loss (optional)
 * @param {number} params.takeProfit - New take profit (optional)
 * @returns {Promise<Object>} Modification result
 */
export async function modifyPosition(mtAccountId, positionId, params) {
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        // Get position from database
        const position = await prisma.mTPosition.findFirst({
            where: {
                mtAccountId,
                positionId
            }
        });
        
        if (!position) {
            throw new Error('Position not found');
        }
        
        // Get MetaAPI connection
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        console.log(`📊 Modifying position ${positionId}:`, params);
        
        // Modify position
        const result = await connection.modifyPosition(
            positionId,
            params.stopLoss,
            params.takeProfit
        );
        
        // Update database
        await prisma.mTPosition.update({
            where: {
                mtAccountId_positionId: {
                    mtAccountId,
                    positionId
                }
            },
            data: {
                stopLoss: params.stopLoss,
                takeProfit: params.takeProfit,
                updateTime: new Date()
            }
        });
        
        console.log(`✅ Position modified:`, result);
        
        return {
            success: true,
            stringCode: result.stringCode,
            message: result.message
        };
        
    } catch (error) {
        console.error(`❌ Error modifying position:`, error);
        throw new Error(`Failed to modify position: ${error.message}`);
    }
}

/**
 * Close a position (fully or partially)
 * @param {string} mtAccountId - Database MT account ID
 * @param {string} positionId - Position ID
 * @param {number} volume - Volume to close (optional, closes all if not specified)
 * @returns {Promise<Object>} Close result
 */
export async function closePosition(mtAccountId, positionId, volume = null) {
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        // Get position from database
        const position = await prisma.mTPosition.findFirst({
            where: {
                mtAccountId,
                positionId
            }
        });
        
        if (!position) {
            throw new Error('Position not found');
        }
        
        // Get MetaAPI connection
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        const closeVolume = volume || position.volume;
        
        console.log(`📊 Closing position ${positionId}, volume: ${closeVolume}`);
        
        // Close position
        const result = await connection.closePosition(positionId, {
            volume: closeVolume
        });
        
        // If fully closed, delete from database
        if (!volume || volume >= position.volume) {
            await prisma.mTPosition.delete({
                where: {
                    mtAccountId_positionId: {
                        mtAccountId,
                        positionId
                    }
                }
            });
        } else {
            // Partially closed, update volume
            await prisma.mTPosition.update({
                where: {
                    mtAccountId_positionId: {
                        mtAccountId,
                        positionId
                    }
                },
                data: {
                    volume: position.volume - closeVolume,
                    updateTime: new Date()
                }
            });
        }
        
        console.log(`✅ Position closed:`, result);
        
        return {
            success: true,
            orderId: result.orderId,
            stringCode: result.stringCode,
            message: result.message
        };
        
    } catch (error) {
        console.error(`❌ Error closing position:`, error);
        throw new Error(`Failed to close position: ${error.message}`);
    }
}

/**
 * Cancel a pending order
 * @param {string} mtAccountId - Database MT account ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Cancel result
 */
export async function cancelOrder(mtAccountId, orderId) {
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        // Get order from database
        const order = await prisma.mTOrder.findFirst({
            where: {
                mtAccountId,
                orderId
            }
        });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        // Get MetaAPI connection
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        console.log(`📊 Cancelling order ${orderId}`);
        
        // Cancel order
        const result = await connection.cancelOrder(orderId);
        
        // Update database
        await prisma.mTOrder.update({
            where: {
                mtAccountId_orderId: {
                    mtAccountId,
                    orderId
                }
            },
            data: {
                state: 'cancelled',
                closeTime: new Date()
            }
        });
        
        console.log(`✅ Order cancelled:`, result);
        
        return {
            success: true,
            stringCode: result.stringCode,
            message: result.message
        };
        
    } catch (error) {
        console.error(`❌ Error cancelling order:`, error);
        throw new Error(`Failed to cancel order: ${error.message}`);
    }
}

/**
 * Get symbol information
 * @param {string} mtAccountId - Database MT account ID
 * @param {string} symbol - Symbol name
 * @returns {Promise<Object>} Symbol information
 */
export async function getSymbolInfo(mtAccountId, symbol) {
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        const symbolInfo = await connection.getSymbolSpecification(symbol);
        
        return {
            symbol: symbolInfo.symbol,
            description: symbolInfo.description,
            digits: symbolInfo.digits,
            contractSize: symbolInfo.contractSize,
            minVolume: symbolInfo.minVolume,
            maxVolume: symbolInfo.maxVolume,
            volumeStep: symbolInfo.volumeStep,
            spread: symbolInfo.spread,
            tickSize: symbolInfo.tickSize,
            tickValue: symbolInfo.tickValue
        };
        
    } catch (error) {
        console.error(`❌ Error getting symbol info:`, error);
        throw new Error(`Failed to get symbol info: ${error.message}`);
    }
}

/**
 * Get current price for a symbol
 * @param {string} mtAccountId - Database MT account ID
 * @param {string} symbol - Symbol name
 * @returns {Promise<Object>} Price information
 */
export async function getSymbolPrice(mtAccountId, symbol) {
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        const price = await connection.getSymbolPrice(symbol);
        
        return {
            symbol: price.symbol,
            bid: price.bid,
            ask: price.ask,
            time: price.time,
            brokerTime: price.brokerTime
        };
        
    } catch (error) {
        console.error(`❌ Error getting symbol price:`, error);
        throw new Error(`Failed to get symbol price: ${error.message}`);
    }
}

/**
 * Calculate required margin for a trade
 * @param {string} mtAccountId - Database MT account ID
 * @param {string} symbol - Symbol name
 * @param {number} volume - Trade volume
 * @param {string} actionType - 'ORDER_TYPE_BUY' or 'ORDER_TYPE_SELL'
 * @returns {Promise<Object>} Margin calculation
 */
export async function calculateMargin(mtAccountId, symbol, volume, actionType) {
    try {
        const mtAccount = await prisma.mTAccount.findUnique({
            where: { id: mtAccountId }
        });
        
        if (!mtAccount) {
            throw new Error('MT account not found');
        }
        
        const api = metaapiService.getMetaAPIInstance();
        const account = await api.metatraderAccountApi.getAccount(mtAccount.metaapiAccountId);
        const connection = account.getRPCConnection();
        
        await connection.connect();
        await connection.waitSynchronized();
        
        const margin = await connection.calculateMargin({
            symbol,
            type: actionType,
            volume,
            openPrice: null // Use current market price
        });
        
        return {
            margin: margin.margin,
            freeMargin: margin.freeMargin,
            marginLevel: margin.marginLevel
        };
        
    } catch (error) {
        console.error(`❌ Error calculating margin:`, error);
        throw new Error(`Failed to calculate margin: ${error.message}`);
    }
}

/**
 * Validate order parameters before placement
 * @param {string} mtAccountId - Database MT account ID
 * @param {Object} orderParams - Order parameters
 * @returns {Promise<Object>} Validation result
 */
export async function validateOrder(mtAccountId, orderParams) {
    try {
        const errors = [];
        
        // Basic validation
        if (!orderParams.symbol) errors.push('Symbol is required');
        if (!orderParams.volume || orderParams.volume <= 0) errors.push('Valid volume is required');
        if (!orderParams.actionType) errors.push('Action type is required');
        
        if (errors.length > 0) {
            return { valid: false, errors };
        }
        
        // Get symbol info
        const symbolInfo = await getSymbolInfo(mtAccountId, orderParams.symbol);
        
        // Validate volume
        if (orderParams.volume < symbolInfo.minVolume) {
            errors.push(`Volume must be at least ${symbolInfo.minVolume}`);
        }
        if (orderParams.volume > symbolInfo.maxVolume) {
            errors.push(`Volume cannot exceed ${symbolInfo.maxVolume}`);
        }
        
        // Calculate required margin
        const marginCalc = await calculateMargin(
            mtAccountId,
            orderParams.symbol,
            orderParams.volume,
            orderParams.actionType
        );
        
        if (marginCalc.freeMargin < marginCalc.margin) {
            errors.push('Insufficient free margin for this trade');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : null,
            symbolInfo,
            marginRequired: marginCalc.margin,
            freeMargin: marginCalc.freeMargin
        };
        
    } catch (error) {
        console.error(`❌ Error validating order:`, error);
        return {
            valid: false,
            errors: [error.message]
        };
    }
}

export default {
    placeMarketOrder,
    placePendingOrder,
    modifyPosition,
    closePosition,
    cancelOrder,
    getSymbolInfo,
    getSymbolPrice,
    calculateMargin,
    validateOrder
};
