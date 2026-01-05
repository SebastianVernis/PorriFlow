/**
 * SV Portfolio - Background Job Scheduler
 * Flexible system for running periodic tasks (price updates, news fetching)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BackgroundScheduler {
    constructor() {
        this.jobs = new Map();
        this.intervals = new Map();
        this.isRunning = false;
    }

    /**
     * Register a new background job
     * @param {string} name - Job identifier
     * @param {Function} fn - Job function to execute
     * @param {number} intervalMs - Interval in milliseconds
     * @param {Object} options - Additional options (enabled, runOnStart)
     */
    register(name, fn, intervalMs, options = {}) {
        const job = {
            name,
            fn,
            intervalMs,
            enabled: options.enabled !== false,
            runOnStart: options.runOnStart || false,
            lastRun: null,
            nextRun: null,
            failCount: 0,
            successCount: 0,
            lastError: null
        };

        this.jobs.set(name, job);
        console.log(`📋 Job registered: ${name} (interval: ${this.formatInterval(intervalMs)})`);
        
        return this;
    }

    /**
     * Start all registered jobs
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️  Scheduler already running');
            return;
        }

        this.isRunning = true;
        console.log('🚀 Starting background scheduler...\n');

        for (const [name, job] of this.jobs) {
            if (!job.enabled) {
                console.log(`⏭️  Skipping disabled job: ${name}`);
                continue;
            }

            // Run immediately if specified
            if (job.runOnStart) {
                this.runJob(name);
            }

            // Schedule periodic execution
            const interval = setInterval(() => {
                this.runJob(name);
            }, job.intervalMs);

            this.intervals.set(name, interval);
            
            const nextRun = new Date(Date.now() + job.intervalMs);
            job.nextRun = nextRun;
            
            console.log(`✅ Job scheduled: ${name}`);
            console.log(`   Next run: ${nextRun.toLocaleString()}`);
        }

        console.log('\n✨ All jobs scheduled successfully');
    }

    /**
     * Stop all jobs
     */
    stop() {
        console.log('🛑 Stopping background scheduler...');
        
        for (const [name, interval] of this.intervals) {
            clearInterval(interval);
            console.log(`   Stopped: ${name}`);
        }

        this.intervals.clear();
        this.isRunning = false;
        
        console.log('✅ Scheduler stopped');
    }

    /**
     * Run a specific job manually
     */
    async runJob(name) {
        const job = this.jobs.get(name);
        if (!job) {
            console.error(`❌ Job not found: ${name}`);
            return;
        }

        if (!job.enabled) {
            console.log(`⏭️  Job disabled: ${name}`);
            return;
        }

        const startTime = Date.now();
        job.lastRun = new Date();

        console.log(`\n⚙️  Running job: ${name}`);
        console.log(`   Started: ${job.lastRun.toLocaleString()}`);

        try {
            await job.fn();
            
            const duration = Date.now() - startTime;
            job.successCount++;
            job.lastError = null;
            job.nextRun = new Date(Date.now() + job.intervalMs);

            console.log(`✅ Job completed: ${name}`);
            console.log(`   Duration: ${duration}ms`);
            console.log(`   Next run: ${job.nextRun.toLocaleString()}`);

        } catch (error) {
            const duration = Date.now() - startTime;
            job.failCount++;
            job.lastError = error.message;

            console.error(`❌ Job failed: ${name}`);
            console.error(`   Error: ${error.message}`);
            console.error(`   Duration: ${duration}ms`);
            console.error(`   Fail count: ${job.failCount}`);

            // Disable job after 5 consecutive failures
            if (job.failCount >= 5) {
                job.enabled = false;
                console.error(`🚨 Job disabled due to repeated failures: ${name}`);
            }
        }
    }

    /**
     * Get job status
     */
    getStatus(name) {
        if (name) {
            return this.jobs.get(name);
        }
        
        return Array.from(this.jobs.values()).map(job => ({
            name: job.name,
            enabled: job.enabled,
            interval: this.formatInterval(job.intervalMs),
            lastRun: job.lastRun,
            nextRun: job.nextRun,
            successCount: job.successCount,
            failCount: job.failCount,
            lastError: job.lastError
        }));
    }

    /**
     * Enable/disable a job
     */
    setJobEnabled(name, enabled) {
        const job = this.jobs.get(name);
        if (!job) {
            throw new Error(`Job not found: ${name}`);
        }

        job.enabled = enabled;
        console.log(`${enabled ? '✅' : '⏸️ '} Job ${enabled ? 'enabled' : 'disabled'}: ${name}`);

        // If disabling, clear interval
        if (!enabled && this.intervals.has(name)) {
            clearInterval(this.intervals.get(name));
            this.intervals.delete(name);
        }

        // If enabling while scheduler is running, start interval
        if (enabled && this.isRunning && !this.intervals.has(name)) {
            const interval = setInterval(() => {
                this.runJob(name);
            }, job.intervalMs);
            
            this.intervals.set(name, interval);
            job.nextRun = new Date(Date.now() + job.intervalMs);
        }
    }

    /**
     * Format interval for display
     */
    formatInterval(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return `${seconds}s`;
    }
}

// Singleton instance
const scheduler = new BackgroundScheduler();

export default scheduler;
export { BackgroundScheduler };
