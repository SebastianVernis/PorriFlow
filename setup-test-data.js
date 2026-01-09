/**
 * Setup test data for multitenancy testing
 */

const API_URL = 'http://localhost:3000/api';

async function login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    return data.token;
}

async function createPortfolio(token, name, description) {
    const response = await fetch(`${API_URL}/portfolios`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
    });
    
    const data = await response.json();
    return data.portfolio;
}

async function addPosition(token, portfolioId, ticker, shares, avgCost) {
    const response = await fetch(`${API_URL}/portfolios/${portfolioId}/positions`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            ticker, 
            shares, 
            avgCost,
            currentPrice: avgCost,
            name: ticker,
            sector: 'Technology'
        })
    });
    
    const data = await response.json();
    return data.position;
}

async function setup() {
    console.log('🏗️  Setting up test data...\n');
    
    // Login admin
    console.log('1️⃣  Logging in as admin...');
    const adminToken = await login('admin', 'Svernis1');
    console.log('   ✅ Admin logged in\n');
    
    // Create admin portfolio
    console.log('2️⃣  Creating admin portfolio...');
    const adminPortfolio = await createPortfolio(
        adminToken, 
        'Admin Portfolio', 
        'Main investment portfolio'
    );
    console.log(`   ✅ Created: ${adminPortfolio.name} (${adminPortfolio.id})\n`);
    
    // Add positions to admin portfolio
    console.log('3️⃣  Adding positions to admin portfolio...');
    await addPosition(adminToken, adminPortfolio.id, 'AAPL', 100, 150.00);
    await addPosition(adminToken, adminPortfolio.id, 'MSFT', 50, 300.00);
    console.log('   ✅ Added 2 positions\n');
    
    // Login porrito
    console.log('4️⃣  Logging in as porrito...');
    const porritoToken = await login('porrito', 'Selapeloalchispa1');
    console.log('   ✅ Porrito logged in\n');
    
    // Create porrito portfolio
    console.log('5️⃣  Creating porrito portfolio...');
    const porritoPortfolio = await createPortfolio(
        porritoToken, 
        'Porrito Portfolio', 
        'Secondary portfolio'
    );
    console.log(`   ✅ Created: ${porritoPortfolio.name} (${porritoPortfolio.id})\n`);
    
    // Add positions to porrito portfolio
    console.log('6️⃣  Adding positions to porrito portfolio...');
    await addPosition(porritoToken, porritoPortfolio.id, 'GOOGL', 25, 140.00);
    await addPosition(porritoToken, porritoPortfolio.id, 'TSLA', 10, 250.00);
    console.log('   ✅ Added 2 positions\n');
    
    console.log('✅ Test data setup complete!\n');
    console.log('Admin portfolio ID:', adminPortfolio.id);
    console.log('Porrito portfolio ID:', porritoPortfolio.id);
}

setup().catch(console.error);
