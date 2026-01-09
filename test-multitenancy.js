/**
 * Test script for multitenancy data isolation
 * Tests that users can only access their own data
 */

// Use native fetch (Node.js 18+)

const API_URL = 'http://localhost:3000/api';

// Test users
const users = {
    admin: { username: 'admin', password: 'Svernis1' },
    porrito: { username: 'porrito', password: 'Selapeloalchispa1' }
};

let tokens = {};
let portfolios = {};

async function login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
        throw new Error(`Login failed for ${username}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.token;
}

async function getPortfolios(token) {
    const response = await fetch(`${API_URL}/portfolios`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
        throw new Error(`Get portfolios failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.portfolios;
}

async function tryAccessPortfolio(token, portfolioId, expectedSuccess) {
    const response = await fetch(`${API_URL}/portfolios/${portfolioId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const success = response.ok;
    const data = success ? await response.json() : await response.text();
    
    if (success !== expectedSuccess) {
        console.error(`❌ SECURITY ISSUE: Expected ${expectedSuccess ? 'success' : 'failure'}, got ${success ? 'success' : 'failure'}`);
        console.error(`   Response:`, data);
        return false;
    }
    
    return true;
}

async function tryUpdatePortfolio(token, portfolioId, expectedSuccess) {
    const response = await fetch(`${API_URL}/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'HACKED' })
    });
    
    const success = response.ok;
    
    if (success !== expectedSuccess) {
        console.error(`❌ SECURITY ISSUE: User could ${success ? 'UPDATE' : 'not update'} another user's portfolio`);
        return false;
    }
    
    return true;
}

async function tryDeletePosition(token, portfolioId, positionId, expectedSuccess) {
    const response = await fetch(`${API_URL}/portfolios/${portfolioId}/positions/${positionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const success = response.ok;
    
    if (success !== expectedSuccess) {
        console.error(`❌ SECURITY ISSUE: User could ${success ? 'DELETE' : 'not delete'} another user's position`);
        return false;
    }
    
    return true;
}

async function runTests() {
    console.log('🔐 Testing Multitenancy Data Isolation\n');
    
    try {
        // 1. Login both users
        console.log('1️⃣  Logging in users...');
        tokens.admin = await login(users.admin.username, users.admin.password);
        tokens.porrito = await login(users.porrito.username, users.porrito.password);
        console.log('   ✅ Both users logged in\n');
        
        // 2. Get portfolios for each user
        console.log('2️⃣  Fetching portfolios...');
        portfolios.admin = await getPortfolios(tokens.admin);
        portfolios.porrito = await getPortfolios(tokens.porrito);
        console.log(`   Admin has ${portfolios.admin.length} portfolio(s)`);
        console.log(`   Porrito has ${portfolios.porrito.length} portfolio(s)\n`);
        
        if (portfolios.admin.length === 0 || portfolios.porrito.length === 0) {
            console.log('⚠️  Warning: One or both users have no portfolios. Some tests will be skipped.\n');
        }
        
        // 3. Test cross-user access
        console.log('3️⃣  Testing cross-user access protection...');
        let allTestsPassed = true;
        
        if (portfolios.admin.length > 0 && portfolios.porrito.length > 0) {
            // Admin tries to access Porrito's portfolio
            console.log('   Testing: Admin accessing Porrito\'s portfolio...');
            const test1 = await tryAccessPortfolio(tokens.admin, portfolios.porrito[0].id, false);
            allTestsPassed = allTestsPassed && test1;
            if (test1) console.log('   ✅ Correctly blocked');
            
            // Porrito tries to access Admin's portfolio
            console.log('   Testing: Porrito accessing Admin\'s portfolio...');
            const test2 = await tryAccessPortfolio(tokens.porrito, portfolios.admin[0].id, false);
            allTestsPassed = allTestsPassed && test2;
            if (test2) console.log('   ✅ Correctly blocked');
            
            // Each user accesses their own
            console.log('   Testing: Admin accessing own portfolio...');
            const test3 = await tryAccessPortfolio(tokens.admin, portfolios.admin[0].id, true);
            allTestsPassed = allTestsPassed && test3;
            if (test3) console.log('   ✅ Correctly allowed');
            
            console.log('   Testing: Porrito accessing own portfolio...');
            const test4 = await tryAccessPortfolio(tokens.porrito, portfolios.porrito[0].id, true);
            allTestsPassed = allTestsPassed && test4;
            if (test4) console.log('   ✅ Correctly allowed\n');
        }
        
        // 4. Test update protection
        console.log('4️⃣  Testing update protection...');
        if (portfolios.admin.length > 0 && portfolios.porrito.length > 0) {
            console.log('   Testing: Porrito trying to update Admin\'s portfolio...');
            const test5 = await tryUpdatePortfolio(tokens.porrito, portfolios.admin[0].id, false);
            allTestsPassed = allTestsPassed && test5;
            if (test5) console.log('   ✅ Correctly blocked\n');
        }
        
        // 5. Test position access
        console.log('5️⃣  Testing position access protection...');
        const adminPositions = portfolios.admin[0]?.positions || [];
        const porritoPositions = portfolios.porrito[0]?.positions || [];
        
        if (adminPositions.length > 0 && portfolios.admin.length > 0) {
            console.log('   Testing: Porrito trying to delete Admin\'s position...');
            const test6 = await tryDeletePosition(
                tokens.porrito, 
                portfolios.admin[0].id, 
                adminPositions[0].id, 
                false
            );
            allTestsPassed = allTestsPassed && test6;
            if (test6) console.log('   ✅ Correctly blocked\n');
        }
        
        // Summary
        console.log('\n' + '='.repeat(50));
        if (allTestsPassed) {
            console.log('✅ ALL MULTITENANCY TESTS PASSED');
            console.log('   Data isolation is working correctly!');
        } else {
            console.log('❌ SOME TESTS FAILED');
            console.log('   Review security issues above!');
        }
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests
runTests();
