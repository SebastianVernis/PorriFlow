# 🚀 EC2 Migration Guide - SV Portfolio Backend

Complete guide for migrating the backend to AWS EC2 for improved performance and historical data processing.

---

## 📋 Table of Contents

1. [Why EC2?](#why-ec2)
2. [Architecture Overview](#architecture-overview)
3. [EC2 Instance Setup](#ec2-instance-setup)
4. [Database Configuration](#database-configuration)
5. [Deployment Process](#deployment-process)
6. [Background Jobs Configuration](#background-jobs-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Cost Estimation](#cost-estimation)

---

## 🎯 Why EC2?

### Current Limitations (Render Free Tier)
- ❌ 512MB RAM limit
- ❌ CPU throttling after 100 hours/month
- ❌ Cold starts (spins down after 15min inactivity)
- ❌ Limited background processing
- ❌ No persistent storage for large datasets

### EC2 Benefits
- ✅ Dedicated resources (no throttling)
- ✅ Always-on (no cold starts)
- ✅ Scalable storage for historical data
- ✅ Better performance for batch jobs
- ✅ WebSocket stability
- ✅ Full control over environment

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Vercel        │  ← Frontend (stays on Vercel)
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTPS/WSS
         ▼
┌─────────────────┐
│   AWS EC2       │  ← Backend (Node.js + Express)
│   t3.small      │     - REST API
│   Ubuntu 22.04  │     - WebSocket Server
│                 │     - Background Jobs
└────────┬────────┘
         │
         │ PostgreSQL
         ▼
┌─────────────────┐
│   Neon          │  ← Database (stays on Neon)
│   PostgreSQL    │
└─────────────────┘
```

---

## 🖥️ EC2 Instance Setup

### 1. Choose Instance Type

**Recommended: t3.small**
- 2 vCPUs
- 2 GB RAM
- Burstable performance
- **Cost**: ~$15/month (with sustained usage)

**Alternative: t3.micro** (for testing)
- 2 vCPUs
- 1 GB RAM
- **Cost**: ~$7.50/month

### 2. Launch Instance

```bash
# AWS Console Steps:
1. Go to EC2 Dashboard
2. Click "Launch Instance"
3. Name: sv-portfolio-backend
4. AMI: Ubuntu Server 22.04 LTS
5. Instance type: t3.small
6. Key pair: Create new or use existing
7. Network settings:
   - Create security group
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
   - Allow Custom TCP (port 3000) for API
8. Storage: 20 GB gp3 SSD
9. Launch instance
```

### 3. Security Group Configuration

```
Inbound Rules:
┌──────────┬──────┬─────────────┬─────────────┐
│ Type     │ Port │ Source      │ Description │
├──────────┼──────┼─────────────┼─────────────┤
│ SSH      │ 22   │ Your IP     │ Management  │
│ HTTP     │ 80   │ 0.0.0.0/0   │ Redirect    │
│ HTTPS    │ 443  │ 0.0.0.0/0   │ API + WS    │
│ Custom   │ 3000 │ 0.0.0.0/0   │ Direct API  │
└──────────┴──────┴─────────────┴─────────────┘
```

### 4. Connect to Instance

```bash
# Get public IP from AWS Console
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt update && sudo apt upgrade -y
```

### 5. Install Dependencies

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install certbot (SSL certificates)
sudo apt install -y certbot python3-certbot-nginx

# Verify installations
node --version   # v20.x.x
npm --version    # 10.x.x
pm2 --version    # 5.x.x
nginx -v         # nginx/1.x.x
```

---

## 🗄️ Database Configuration

### Option 1: Keep Neon (Recommended)

**Pros:**
- ✅ Already configured
- ✅ Managed service (no maintenance)
- ✅ Automatic backups
- ✅ Generous free tier (3GB)

**Configuration:**
```bash
# In EC2, set environment variable
export DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
```

### Option 2: Local PostgreSQL on EC2

**Pros:**
- ✅ Lower latency
- ✅ No external dependencies
- ✅ More storage

**Cons:**
- ❌ Manual maintenance
- ❌ Need to manage backups
- ❌ Additional cost for EBS storage

**Installation:**
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE svportfolio;
CREATE USER svuser WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE svportfolio TO svuser;
\q
```

---

## 🚀 Deployment Process

### 1. Transfer Code to EC2

```bash
# On your local machine
cd /path/to/inversion
tar -czf backend.tar.gz backend/

# Upload to EC2
scp -i your-key.pem backend.tar.gz ubuntu@YOUR_EC2_IP:/home/ubuntu/

# On EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
tar -xzf backend.tar.gz
cd backend
```

### 2. Install Dependencies

```bash
npm install
npx prisma generate
```

### 3. Environment Configuration

```bash
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
SESSION_EXPIRY="7d"

# Server
NODE_ENV="production"
PORT=3000

# CORS
ALLOWED_ORIGINS="https://sv-portfolio-dashboard.vercel.app"

# Background Jobs
ENABLE_BACKGROUND_JOBS=true

# Optional API Keys
FINNHUB_API_KEY=""
MARKETSTACK_API_KEY=""
ALPHAVANTAGE_API_KEY=""
EOF

chmod 600 .env
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 5. Start Application with PM2

```bash
# Start app
pm2 start src/server.js --name sv-portfolio

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs

# Monitor
pm2 status
pm2 logs sv-portfolio
```

### 6. Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/sv-portfolio
```

```nginx
upstream backend {
    server localhost:3000;
}

# HTTP -> HTTPS redirect
server {
    listen 80;
    server_name api.yourDomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name api.yourDomain.com;

    # SSL (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/api.yourDomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourDomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sv-portfolio /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 7. Setup SSL Certificate

```bash
# Get free SSL from Let's Encrypt
sudo certbot --nginx -d api.yourDomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## ⚙️ Background Jobs Configuration

### Jobs Enabled on EC2

```javascript
1. news-update-popular     → Every 30 minutes
2. news-update-all         → Every 6 hours
3. historical-data-download → Every 24 hours (NEW)
4. price-cache-update      → Every 5 minutes (NEW)
5. cache-cleanup           → Every 24 hours
```

### Monitor Jobs

```bash
# PM2 logs
pm2 logs sv-portfolio --lines 100

# Check specific job execution
pm2 logs sv-portfolio | grep "historical-data"
```

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# Dashboard
pm2 monit

# Status
pm2 status

# Restart
pm2 restart sv-portfolio

# Reload (zero-downtime)
pm2 reload sv-portfolio

# Stop
pm2 stop sv-portfolio
```

### System Monitoring

```bash
# CPU & Memory
htop

# Disk usage
df -h

# Database connections
sudo netstat -an | grep 5432

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Automated Backups

```bash
# Create backup script
cat > /home/ubuntu/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /home/ubuntu/backups/backup_$DATE.sql
# Keep only last 7 days
find /home/ubuntu/backups -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup-db.sh

# Schedule with cron
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

---

## 💰 Cost Estimation

### Monthly Costs

```
AWS EC2 (t3.small):        $15.00
EBS Storage (20GB):        $ 2.00
Data Transfer (10GB):      $ 0.90
────────────────────────────────
Subtotal AWS:              $17.90

Neon PostgreSQL:           $ 0.00 (free tier)
Vercel (Frontend):         $ 0.00 (free tier)
Domain (optional):         $ 1.00/month
────────────────────────────────
TOTAL:                     ~$19/month
```

### Cost Optimization Tips

1. **Use Reserved Instances**: Save 30-40% with 1-year commitment
2. **Stop during off-hours**: If not 24/7, save ~50%
3. **Use t3.micro initially**: Start small, scale up if needed
4. **Monitor usage**: AWS Cost Explorer to track spending

---

## 🔄 Update Process

### Deploy New Version

```bash
# On local machine
git push origin master

# On EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
cd ~/backend
git pull origin master
npm install
npx prisma generate
pm2 reload sv-portfolio
```

### Automated Deployment (CI/CD)

Setup GitHub Actions to auto-deploy:

```yaml
# .github/workflows/deploy-ec2.yml
name: Deploy to EC2

on:
  push:
    branches: [ master ]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/backend
            git pull origin master
            npm install
            npx prisma generate
            pm2 reload sv-portfolio
```

---

## 📝 Checklist

### Pre-Migration
- [ ] Backup current database
- [ ] Export environment variables
- [ ] Document current configuration
- [ ] Test locally with production data

### Migration
- [ ] Launch EC2 instance
- [ ] Configure security groups
- [ ] Install dependencies
- [ ] Transfer code
- [ ] Configure environment
- [ ] Run migrations
- [ ] Start with PM2
- [ ] Setup Nginx
- [ ] Configure SSL
- [ ] Test API endpoints
- [ ] Test WebSocket connection

### Post-Migration
- [ ] Update frontend API URL
- [ ] Monitor logs for 24h
- [ ] Verify background jobs running
- [ ] Test all features
- [ ] Setup monitoring alerts
- [ ] Configure backups
- [ ] Document any issues

---

## 🆘 Troubleshooting

### App Won't Start

```bash
# Check logs
pm2 logs sv-portfolio --err

# Common issues:
# 1. Port already in use
sudo lsof -i :3000
sudo kill -9 <PID>

# 2. Database connection
# Test connection string
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('Connected')).catch(e => console.error(e));"

# 3. Missing dependencies
npm install
npx prisma generate
```

### WebSocket Not Working

```bash
# Check Nginx configuration
sudo nginx -t

# Verify WebSocket upgrade headers
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  http://localhost:3000/ws

# Check firewall
sudo ufw status
```

### High Memory Usage

```bash
# Check process
pm2 monit

# Restart if needed
pm2 restart sv-portfolio

# Increase max memory (if needed)
pm2 start src/server.js --name sv-portfolio --max-memory-restart 1G
```

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

## 🎉 Benefits After Migration

✅ **Performance**
- 5-10x faster API responses
- No cold starts
- Stable WebSocket connections

✅ **Reliability**
- 99.9% uptime
- No throttling
- Predictable performance

✅ **Features**
- Full background job support
- Historical data processing
- Real-time price updates

✅ **Scalability**
- Easy to upgrade instance type
- Can add load balancer later
- Support for more concurrent users

---

**Ready to migrate? Follow the steps above and you'll have a production-grade backend running on EC2!** 🚀
