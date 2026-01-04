import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create demo user
    const demoPassword = await bcrypt.hash('demo123456', 10);
    
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@svportfolio.com' },
        update: {},
        create: {
            email: 'demo@svportfolio.com',
            username: 'demo',
            password: demoPassword,
            name: 'Demo User',
            portfolios: {
                create: [
                    {
                        name: 'Portafolio Principal',
                        isDefault: true,
                        positions: {
                            create: [
                                {
                                    ticker: 'AAPL',
                                    name: 'Apple Inc.',
                                    sector: 'Tecnología',
                                    shares: 10,
                                    avgCost: 150.00,
                                    currentPrice: 185.50,
                                    beta: 1.24,
                                    dgr: 7.5,
                                    dividendYield: 0.5,
                                    isCrypto: false
                                },
                                {
                                    ticker: 'MSFT',
                                    name: 'Microsoft Corp.',
                                    sector: 'Tecnología',
                                    shares: 8,
                                    avgCost: 350.00,
                                    currentPrice: 375.20,
                                    beta: 0.89,
                                    dgr: 10.2,
                                    dividendYield: 0.8,
                                    isCrypto: false
                                },
                                {
                                    ticker: 'JNJ',
                                    name: 'Johnson & Johnson',
                                    sector: 'Salud',
                                    shares: 15,
                                    avgCost: 160.00,
                                    currentPrice: 165.30,
                                    beta: 0.54,
                                    dgr: 5.8,
                                    dividendYield: 3.0,
                                    isCrypto: false
                                }
                            ]
                        }
                    },
                    {
                        name: 'Portafolio Crypto',
                        isDefault: false,
                        positions: {
                            create: [
                                {
                                    ticker: 'BTC-USD',
                                    name: 'Bitcoin',
                                    sector: 'Crypto',
                                    shares: 0.05,
                                    avgCost: 85000.00,
                                    currentPrice: 91320.00,
                                    beta: 2.5,
                                    dgr: 0.0,
                                    dividendYield: 0.0,
                                    isCrypto: true
                                },
                                {
                                    ticker: 'ETH-USD',
                                    name: 'Ethereum',
                                    sector: 'Crypto',
                                    shares: 0.5,
                                    avgCost: 3200.00,
                                    currentPrice: 3450.00,
                                    beta: 2.8,
                                    dgr: 0.0,
                                    dividendYield: 0.0,
                                    isCrypto: true
                                }
                            ]
                        }
                    }
                ]
            },
            settings: {
                create: {
                    riskFreeRate: 4.5,
                    marketVolatility: 15.0,
                    annualTarget: 20.0,
                    refreshInterval: 5,
                    currency: 'USD'
                }
            }
        }
    });

    console.log('✅ Demo user created:');
    console.log('   Email: demo@svportfolio.com');
    console.log('   Password: demo123456');
    console.log('   Portfolios: 2 (Principal + Crypto)');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123456', 10);
    
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@svportfolio.com' },
        update: {},
        create: {
            email: 'admin@svportfolio.com',
            username: 'admin',
            password: adminPassword,
            name: 'Admin User',
            portfolios: {
                create: {
                    name: 'Portafolio Principal',
                    isDefault: true
                }
            },
            settings: {
                create: {
                    riskFreeRate: 4.5,
                    marketVolatility: 15.0,
                    annualTarget: 20.0,
                    refreshInterval: 5,
                    currency: 'USD'
                }
            }
        }
    });

    console.log('✅ Admin user created:');
    console.log('   Email: admin@svportfolio.com');
    console.log('   Password: admin123456');

    console.log('\n🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
