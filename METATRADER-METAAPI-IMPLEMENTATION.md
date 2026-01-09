# 🔌 MetaTrader + MetaAPI Integration - Implementation Plan

**Project:** SV Portfolio Manager v3.0  
**Date:** 2026-01-09  
**Status:** Analysis & Planning Phase

---

## 📋 Executive Summary

This document outlines the comprehensive implementation plan for integrating **MetaTrader 4/5** trading capabilities into the SV Portfolio Manager using **MetaAPI Cloud SDK**. This integration will enable users to:

- Connect their MetaTrader accounts
- Sync live trading positions automatically
- Execute trades directly from the dashboard
- Monitor real-time forex/CFD market data
- Analyze trading performance with MetaStats
- Implement copy-trading strategies

---

## 🎯 Integration Objectives

### Primary Goals
1. **Account Connection**: Allow users to link MT4/MT5 accounts via MetaAPI
2. **Position Synchronization**: Auto-sync trading positions to portfolio
3. **Real-time Data**: Stream live prices and account updates via WebSocket
4. **Trade Execution**: Enable order placement from the dashboard
5. **Risk Management**: Implement risk controls and monitoring
6. **Performance Analytics**: Integrate MetaStats for trading metrics

### Secondary Goals
7. **Copy Trading**: Enable CopyFactory integration for strategy copying
8. **Multi-Account Support**: Manage multiple MT accounts per user
9. **Historical Analysis**: Import and analyze historical trading data
10. **Automated Trading**: Support for trading bots and algorithms

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Dashboard UI │  │ Trading Panel│  │ MT Accounts  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼────────────┘
          │                  │                  │
          │ REST API         │ WebSocket        │ REST API
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼────────────┐
│                  BACKEND (Render)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express.js + Prisma ORM                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  NEW: MetaAPI Service Layer                          │  │
│  │  - metaapi-service.js (Core integration)             │  │
│  │  - metaapi-sync-service.js (Position sync)           │  │
│  │  - metaapi-trading-service.js (Order execution)      │  │
│  │  - metaapi-websocket-service.js (Real-time streams)  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           │ PostgreSQL                      │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Database (Neon PostgreSQL)                   │  │
│  │  NEW TABLES:                                         │  │
│  │  - mt_accounts (MetaTrader account credentials)      │  │
│  │  - mt_positions (Synced trading positions)           │  │
│  │  - mt_orders (Order history)                         │  │
│  │  - mt_sync_logs (Synchronization logs)               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ MetaAPI Cloud SDK
                          │ (REST + WebSocket)
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              MetaAPI Cloud Platform                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ MetaAPI RPC  │  │ Streaming API│  │ CopyFactory  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼────────────┐
│           User's MetaTrader 4/5 Accounts                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Broker A     │  │ Broker B     │  │ Broker C     │     │
│  │ MT5 Account  │  │ MT4 Account  │  │ MT5 Account  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Extensions

### New Tables

#### 1. `mt_accounts` - MetaTrader Account Credentials
```sql
CREATE TABLE mt_accounts (
  id                  TEXT PRIMARY KEY DEFAULT cuid(),
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- MetaAPI Configuration
  metaapi_account_id  TEXT UNIQUE NOT NULL,
  account_name        TEXT NOT NULL,
  account_type        TEXT NOT NULL, -- 'cloud', 'self-hosted'
  platform            TEXT NOT NULL, -- 'mt4', 'mt5'
  broker              TEXT NOT NULL,
  server              TEXT NOT NULL,
  login               TEXT NOT NULL,
  
  -- Account Status
  status              TEXT DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  is_active           BOOLEAN DEFAULT true,
  last_sync_at        TIMESTAMP,
  sync_enabled        BOOLEAN DEFAULT true,
  
  -- MetaAPI Token (encrypted)
  access_token        TEXT, -- Account-specific access token
  
  -- Account Info
  currency            TEXT DEFAULT 'USD',
  leverage            INTEGER,
  account_balance     DECIMAL(15,2),
  account_equity      DECIMAL(15,2),
  account_margin      DECIMAL(15,2),
  
  -- Sync Settings
  auto_sync_positions BOOLEAN DEFAULT true,
  auto_sync_orders    BOOLEAN DEFAULT true,
  sync_interval       INTEGER DEFAULT 60, -- seconds
  
  -- Metadata
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_metaapi_account_id (metaapi_account_id),
  INDEX idx_status (status)
);
```

#### 2. `mt_positions` - Synced Trading Positions
```sql
CREATE TABLE mt_positions (
  id                  TEXT PRIMARY KEY DEFAULT cuid(),
  mt_account_id       TEXT NOT NULL REFERENCES mt_accounts(id) ON DELETE CASCADE,
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  portfolio_id        TEXT REFERENCES portfolios(id) ON DELETE SET NULL,
  
  -- Position Identification
  position_id         TEXT NOT NULL, -- MetaAPI position ID
  ticket              TEXT NOT NULL, -- MT ticket number
  
  -- Position Details
  symbol              TEXT NOT NULL,
  type                TEXT NOT NULL, -- 'POSITION_TYPE_BUY', 'POSITION_TYPE_SELL'
  volume              DECIMAL(15,5) NOT NULL,
  open_price          DECIMAL(15,5) NOT NULL,
  current_price       DECIMAL(15,5),
  
  -- P&L
  profit              DECIMAL(15,2),
  swap                DECIMAL(15,2),
  commission          DECIMAL(15,2),
  
  -- Risk Management
  stop_loss           DECIMAL(15,5),
  take_profit         DECIMAL(15,5),
  
  -- Timestamps
  open_time           TIMESTAMP NOT NULL,
  update_time         TIMESTAMP,
  
  -- Sync Status
  is_synced           BOOLEAN DEFAULT false,
  last_sync_at        TIMESTAMP,
  
  -- Metadata
  comment             TEXT,
  magic_number        INTEGER,
  
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(mt_account_id, position_id),
  INDEX idx_mt_account (mt_account_id),
  INDEX idx_user (user_id),
  INDEX idx_symbol (symbol),
  INDEX idx_open_time (open_time)
);
```

#### 3. `mt_orders` - Order History
```sql
CREATE TABLE mt_orders (
  id                  TEXT PRIMARY KEY DEFAULT cuid(),
  mt_account_id       TEXT NOT NULL REFERENCES mt_accounts(id) ON DELETE CASCADE,
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Order Identification
  order_id            TEXT NOT NULL,
  ticket              TEXT NOT NULL,
  
  -- Order Details
  symbol              TEXT NOT NULL,
  type                TEXT NOT NULL, -- 'ORDER_TYPE_BUY', 'ORDER_TYPE_SELL', etc.
  volume              DECIMAL(15,5) NOT NULL,
  open_price          DECIMAL(15,5),
  close_price         DECIMAL(15,5),
  
  -- Order Status
  state               TEXT NOT NULL, -- 'pending', 'filled', 'cancelled', 'rejected'
  
  -- P&L
  profit              DECIMAL(15,2),
  swap                DECIMAL(15,2),
  commission          DECIMAL(15,2),
  
  -- Risk Management
  stop_loss           DECIMAL(15,5),
  take_profit         DECIMAL(15,5),
  
  -- Timestamps
  open_time           TIMESTAMP NOT NULL,
  close_time          TIMESTAMP,
  
  -- Metadata
  comment             TEXT,
  magic_number        INTEGER,
  
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(mt_account_id, order_id),
  INDEX idx_mt_account (mt_account_id),
  INDEX idx_user (user_id),
  INDEX idx_symbol (symbol),
  INDEX idx_state (state),
  INDEX idx_open_time (open_time)
);
```

#### 4. `mt_sync_logs` - Synchronization Logs
```sql
CREATE TABLE mt_sync_logs (
  id                  TEXT PRIMARY KEY DEFAULT cuid(),
  mt_account_id       TEXT NOT NULL REFERENCES mt_accounts(id) ON DELETE CASCADE,
  
  -- Sync Details
  sync_type           TEXT NOT NULL, -- 'positions', 'orders', 'account_info', 'full'
  status              TEXT NOT NULL, -- 'success', 'error', 'partial'
  
  -- Results
  items_synced        INTEGER DEFAULT 0,
  items_failed        INTEGER DEFAULT 0,
  error_message       TEXT,
  
  -- Performance
  duration_ms         INTEGER,
  
  -- Timestamp
  synced_at           TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_mt_account (mt_account_id),
  INDEX idx_sync_type (sync_type),
  INDEX idx_synced_at (synced_at)
);
```

#### 5. Update `user_settings` Table
```sql
ALTER TABLE user_settings ADD COLUMN metaapi_token TEXT;
ALTER TABLE user_settings ADD COLUMN metaapi_enabled BOOLEAN DEFAULT false;
```

---

## 🔧 Backend Implementation

### Phase 1: Core MetaAPI Service

#### File: `backend/src/services/metaapi-service.js`
**Purpose:** Core MetaAPI SDK wrapper and account management

**Key Functions:**
- `initializeMetaAPI(token)` - Initialize SDK with user token
- `createAccount(accountConfig)` - Register new MT account with MetaAPI
- `getAccount(accountId)` - Retrieve account details
- `deployAccount(accountId)` - Deploy account for trading
- `undeployAccount(accountId)` - Undeploy account
- `testConnection(accountId)` - Test account connectivity
- `getAccountInformation(accountId)` - Get balance, equity, margin
- `getPositions(accountId)` - Fetch open positions
- `getOrders(accountId)` - Fetch pending orders
- `getHistory(accountId, options)` - Get historical trades

**Dependencies:**
```json
{
  "metaapi.cloud-sdk": "^29.3.2"
}
```

---

### Phase 2: Position Synchronization Service

#### File: `backend/src/services/metaapi-sync-service.js`
**Purpose:** Sync MT positions with portfolio database

**Key Functions:**
- `syncPositions(mtAccountId)` - Sync all positions for an account
- `syncSinglePosition(mtAccountId, positionId)` - Sync specific position
- `syncToPortfolio(mtAccountId, portfolioId)` - Map MT positions to portfolio
- `handlePositionUpdate(event)` - Handle real-time position updates
- `handlePositionClosed(event)` - Handle position closure
- `reconcilePositions(mtAccountId)` - Reconcile DB with MT state
- `logSyncResult(mtAccountId, result)` - Log sync operations

**Sync Strategy:**
1. Fetch positions from MetaAPI
2. Compare with database records
3. Create/update/delete as needed
4. Update portfolio positions if mapped
5. Log sync results

---

### Phase 3: Trading Operations Service

#### File: `backend/src/services/metaapi-trading-service.js`
**Purpose:** Execute trading operations via MetaAPI

**Key Functions:**
- `placeMarketOrder(accountId, params)` - Place market order
- `placePendingOrder(accountId, params)` - Place pending order
- `modifyPosition(accountId, positionId, params)` - Modify SL/TP
- `closePosition(accountId, positionId, volume)` - Close position
- `cancelOrder(accountId, orderId)` - Cancel pending order
- `getSymbolInfo(accountId, symbol)` - Get symbol specifications
- `calculateMargin(accountId, symbol, volume)` - Calculate required margin
- `validateOrder(accountId, orderParams)` - Validate order before placement

**Order Parameters:**
```javascript
{
  symbol: 'EURUSD',
  actionType: 'ORDER_TYPE_BUY', // or ORDER_TYPE_SELL
  volume: 0.1,
  stopLoss: 1.0850,
  takeProfit: 1.0950,
  comment: 'SV Portfolio Trade',
  magicNumber: 123456
}
```

---

### Phase 4: Real-time WebSocket Service

#### File: `backend/src/services/metaapi-websocket-service.js`
**Purpose:** Handle real-time streaming data from MetaAPI

**Key Functions:**
- `subscribeToAccount(accountId)` - Subscribe to account updates
- `unsubscribeFromAccount(accountId)` - Unsubscribe
- `handlePriceUpdate(event)` - Process price updates
- `handlePositionUpdate(event)` - Process position changes
- `handleOrderUpdate(event)` - Process order updates
- `handleAccountUpdate(event)` - Process account info changes
- `broadcastToUser(userId, event)` - Send updates to frontend via WS

**Event Types:**
- `price` - Real-time price updates
- `position` - Position opened/modified/closed
- `order` - Order placed/filled/cancelled
- `account` - Balance/equity/margin changes
- `error` - Connection or trading errors

---

### Phase 5: API Routes

#### File: `backend/src/routes/metatrader.js`
**Purpose:** REST API endpoints for MetaTrader integration

**Endpoints:**

##### Account Management
```
POST   /api/metatrader/accounts              - Add MT account
GET    /api/metatrader/accounts              - List user's MT accounts
GET    /api/metatrader/accounts/:id          - Get account details
PUT    /api/metatrader/accounts/:id          - Update account settings
DELETE /api/metatrader/accounts/:id          - Remove account
POST   /api/metatrader/accounts/:id/deploy   - Deploy account
POST   /api/metatrader/accounts/:id/undeploy - Undeploy account
GET    /api/metatrader/accounts/:id/test     - Test connection
```

##### Position Management
```
GET    /api/metatrader/accounts/:id/positions           - Get positions
POST   /api/metatrader/accounts/:id/positions/sync      - Trigger sync
GET    /api/metatrader/accounts/:id/positions/:posId    - Get position details
PUT    /api/metatrader/accounts/:id/positions/:posId    - Modify position
DELETE /api/metatrader/accounts/:id/positions/:posId    - Close position
```

##### Trading Operations
```
POST   /api/metatrader/accounts/:id/orders              - Place order
GET    /api/metatrader/accounts/:id/orders              - Get pending orders
DELETE /api/metatrader/accounts/:id/orders/:orderId     - Cancel order
GET    /api/metatrader/accounts/:id/history             - Get trade history
```

##### Market Data
```
GET    /api/metatrader/accounts/:id/symbols             - Get available symbols
GET    /api/metatrader/accounts/:id/symbols/:symbol     - Get symbol info
GET    /api/metatrader/accounts/:id/quotes/:symbol      - Get real-time quote
```

##### Synchronization
```
POST   /api/metatrader/accounts/:id/sync/full           - Full account sync
POST   /api/metatrader/accounts/:id/sync/positions      - Sync positions only
POST   /api/metatrader/accounts/:id/sync/orders         - Sync orders only
GET    /api/metatrader/accounts/:id/sync/logs           - Get sync logs
```

---

## 🎨 Frontend Implementation

### Phase 6: UI Components

#### 1. MetaTrader Account Connection Page
**File:** `public/metatrader.html`

**Features:**
- Add new MT account form
- Account list with status indicators
- Deploy/undeploy controls
- Connection test button
- Sync settings configuration

**Form Fields:**
- Account Name
- Platform (MT4/MT5)
- Broker Name
- Server
- Login
- Password (encrypted)
- MetaAPI Access Token

#### 2. Trading Panel Component
**File:** `public/assets/js/trading-panel.js`

**Features:**
- Symbol selector
- Order type selector (Market/Pending)
- Volume input
- Stop Loss / Take Profit inputs
- Buy/Sell buttons
- Position list with modify/close actions
- Pending orders list with cancel actions

#### 3. MT Positions Widget
**File:** `public/assets/js/mt-positions-widget.js`

**Features:**
- Real-time position updates
- P&L display (profit/loss)
- Position details (symbol, volume, price)
- Quick close buttons
- Modify SL/TP inline
- Sync status indicator

#### 4. Account Dashboard Widget
**File:** `public/assets/js/mt-account-widget.js`

**Features:**
- Balance display
- Equity display
- Margin usage
- Free margin
- Margin level percentage
- Account status indicator
- Last sync timestamp

---

### Phase 7: Real-time Updates

#### WebSocket Client Integration
**File:** `public/assets/js/metaapi-websocket-client.js`

**Features:**
- Connect to backend WebSocket
- Subscribe to MT account updates
- Handle price updates
- Handle position updates
- Handle order updates
- Handle account info updates
- Update UI in real-time
- Reconnection logic

**Event Handlers:**
```javascript
{
  'mt:price': handlePriceUpdate,
  'mt:position': handlePositionUpdate,
  'mt:order': handleOrderUpdate,
  'mt:account': handleAccountUpdate,
  'mt:error': handleError
}
```

---

## 🔐 Security Considerations

### 1. Token Management
- Store MetaAPI tokens encrypted in database
- Use environment variables for master API token
- Implement token rotation mechanism
- Support account-specific access tokens

### 2. API Key Protection
- Never expose tokens in frontend
- Use backend proxy for all MetaAPI calls
- Implement rate limiting
- Log all trading operations

### 3. Trading Authorization
- Require additional confirmation for trades
- Implement trading limits per user
- Support 2FA for trading operations
- Audit trail for all trades

### 4. Data Encryption
- Encrypt MT account credentials
- Use HTTPS for all communications
- Encrypt WebSocket connections (WSS)
- Secure token storage

---

## 📈 Implementation Phases & Timeline

### Phase 1: Foundation (Week 1)
- [ ] Install MetaAPI SDK
- [ ] Create database migrations
- [ ] Implement core metaapi-service.js
- [ ] Add MT account management routes
- [ ] Create account connection UI

### Phase 2: Synchronization (Week 2)
- [ ] Implement metaapi-sync-service.js
- [ ] Create position sync logic
- [ ] Add sync API endpoints
- [ ] Build position display UI
- [ ] Test sync reliability

### Phase 3: Trading Operations (Week 3)
- [ ] Implement metaapi-trading-service.js
- [ ] Add trading API endpoints
- [ ] Create trading panel UI
- [ ] Implement order validation
- [ ] Test order execution

### Phase 4: Real-time Streaming (Week 4)
- [ ] Implement metaapi-websocket-service.js
- [ ] Integrate with existing WebSocket service
- [ ] Create frontend WebSocket client
- [ ] Implement real-time UI updates
- [ ] Test streaming performance

### Phase 5: Advanced Features (Week 5-6)
- [ ] Add CopyFactory integration
- [ ] Implement MetaStats analytics
- [ ] Create performance dashboards
- [ ] Add risk management features
- [ ] Implement automated trading support

### Phase 6: Testing & Optimization (Week 7)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] User acceptance testing

### Phase 7: Deployment (Week 8)
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] User onboarding materials
- [ ] Support documentation
- [ ] Launch announcement

---

## 🧪 Testing Strategy

### Unit Tests
- MetaAPI service functions
- Sync logic
- Trading operations
- Data transformations

### Integration Tests
- API endpoint testing
- Database operations
- MetaAPI connectivity
- WebSocket communication

### End-to-End Tests
- Account connection flow
- Position synchronization
- Order placement
- Real-time updates

### Performance Tests
- Sync performance with large position counts
- WebSocket message throughput
- API response times
- Database query optimization

---

## 📊 Monitoring & Logging

### Metrics to Track
- Account connection status
- Sync success/failure rates
- Order execution latency
- WebSocket connection stability
- API error rates
- Database performance

### Logging Strategy
- All trading operations
- Sync operations
- API calls to MetaAPI
- WebSocket events
- Error conditions
- Performance metrics

### Alerting
- Account disconnections
- Sync failures
- Trading errors
- High latency
- Rate limit warnings

---

## 💰 Cost Considerations

### MetaAPI Pricing
- Check current pricing at https://metaapi.cloud/pricing
- Consider free tier limitations
- Plan for scaling costs
- Monitor API usage

### Infrastructure
- Additional database storage for MT data
- Increased API server load
- WebSocket connection overhead
- Bandwidth for real-time streaming

---

## 📚 Documentation Requirements

### User Documentation
- How to connect MT account
- Trading panel guide
- Position management
- Risk management features
- Troubleshooting guide

### Developer Documentation
- API endpoint reference
- Service architecture
- Database schema
- WebSocket protocol
- Deployment guide

### Admin Documentation
- System monitoring
- User support procedures
- Troubleshooting guide
- Maintenance procedures

---

## 🚀 Success Criteria

### Technical
- ✅ Successful account connection
- ✅ Real-time position sync (<5 sec latency)
- ✅ Order execution success rate >99%
- ✅ WebSocket uptime >99.9%
- ✅ Zero data loss during sync

### User Experience
- ✅ Intuitive account setup (<5 min)
- ✅ Clear position display
- ✅ Easy trade execution
- ✅ Real-time updates
- ✅ Reliable synchronization

### Business
- ✅ User adoption rate >30%
- ✅ Trading volume growth
- ✅ User satisfaction score >4.5/5
- ✅ Support ticket rate <5%

---

## 🔄 Future Enhancements

### Phase 2 Features
- Multi-account portfolio aggregation
- Advanced charting with TradingView
- Custom trading indicators
- Backtesting capabilities
- Strategy marketplace

### Phase 3 Features
- Mobile app integration
- Social trading features
- AI-powered trade suggestions
- Risk scoring system
- Automated portfolio rebalancing

---

## 📞 Support & Resources

### MetaAPI Resources
- Documentation: https://metaapi.cloud/docs/client/
- GitHub: https://github.com/metaapi/metaapi-javascript-sdk
- Support: support@metaapi.cloud
- Community: MetaAPI Discord/Slack

### Internal Resources
- Project Repository: /vercel/sandbox
- Backend: /vercel/sandbox/backend
- Frontend: /vercel/sandbox/public
- Documentation: /vercel/sandbox/docs

---

## ✅ Next Steps

1. **Review this implementation plan**
2. **Obtain MetaAPI API token** from https://app.metaapi.cloud
3. **Set up development environment** with MetaAPI SDK
4. **Create database migrations** for new tables
5. **Begin Phase 1 implementation** (Foundation)
6. **Set up testing environment** with demo MT account
7. **Implement core services** following the architecture
8. **Build UI components** for account management
9. **Test integration** thoroughly
10. **Deploy to production** with monitoring

---

**Status:** ✅ Analysis Complete - Ready for Implementation  
**Estimated Timeline:** 8 weeks  
**Risk Level:** Medium (external API dependency)  
**Priority:** High (major feature addition)

---

*This document will be updated as implementation progresses.*
