/**
 * Class for managing memory usage in applications by monitoring memory consumption, triggering optimizations,
 * and handling large datasets efficiently. Supports garbage collection and heap compaction in Node.js environments
 * and adapts to browser contexts.
 *
 * You need to run Node.js with the --expose-gc flag to make global.gc available.
 * node --expose-gc your-app.js
 * 
 * @class MemoryManager
 * @description Manages memory optimization processes, including monitoring, garbage collection, and heap compaction,
 * especially during low-traffic periods. Useful for processing large datasets and minimizing memory overhead.
 *
 * @method processLargeDataInChunks
 * Processes large datasets in chunks to minimize memory usage. Optimizes memory when usage exceeds the defined threshold
 * during low-traffic periods.
 * 
 * @param {Array} dataArray - The data array to process in chunks.
 * @param {function(Array):void} processCallback - Callback function to process each chunk.
 * @returns {Promise<void>} A promise resolving when the data processing completes.
 */
class MemoryManager {
    constructor({
        memoryThreshold = 200 * 1024 * 1024, // Default 200 MB threshold for memory optimization
        checkInterval = 5000, // Check memory every 5 seconds
        lowTraffic = () => true // Custom function to detect low-traffic periods
    } = {}) {
        this.memoryThreshold = memoryThreshold;
        this.lowTraffic = lowTraffic;
        this.checkInterval = checkInterval;
        this.monitorInterval = null;
        this.compactionScheduled = false; // Track heap compaction scheduling
    }

    /**
     * Starts monitoring memory usage and triggers garbage collection or heap compaction
     * when memory usage exceeds the defined threshold.
     */
    startMonitoring() {
        this.monitorInterval = setInterval(() => {
            const memoryUsage = this.getMemoryUsage();
            console.log(`Memory usage: ${Math.round(memoryUsage / 1024 / 1024)} MB`);

            if (memoryUsage > this.memoryThreshold) {
                this.optimizeMemory();
                if (this.lowTraffic()) {
                    this.scheduleHeapCompaction();
                }
            }
        }, this.checkInterval);
    }

    /**
     * Stops the memory monitoring process.
     */
    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            console.log('Memory monitoring stopped.');
        }
    }

    /**
     * Retrieves the current memory usage, supporting both Node.js and browser environments.
     *
     * @returns {number} The current memory usage in bytes, or 0 if unsupported.
     */
    getMemoryUsage() {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            return process.memoryUsage().heapUsed; // Node.js
        }
        if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
            return window.performance.memory.usedJSHeapSize; // Browser
        }
        console.warn('Memory usage monitoring is not supported in this environment.');
        return 0;
    }

    /**
     * Optimizes memory by triggering garbage collection (in Node.js) or relying on the JavaScript engine in the browser.
     */
    optimizeMemory() {
        console.log('Optimizing memory...');
        if (global.gc) {
            console.log('Triggering garbage collection...');
            global.gc({ type: 'major' });
        } else {
            console.warn('Garbage collection not available. Relying on JS engine.');
        }
    }

    /**
     * Schedules heap compaction if in a low-traffic period. The actual compaction is handled by the JS engine.
     */
    scheduleHeapCompaction() {
        if (!this.compactionScheduled && this.lowTraffic()) {
            console.log('Scheduling heap compaction...');
            setTimeout(() => this.compactHeap(), 5000); // Simulate waiting for low-traffic period
            this.compactionScheduled = true;
        }
    }

    /**
     * Performs heap compaction by triggering garbage collection, if available, in Node.js.
     */
    compactHeap() {
        console.log('Performing heap compaction...');
        if (global.gc) {
            global.gc({ type: 'major' }); // Node.js
        } else {
            console.warn('Heap compaction not available (requires Node.js --expose-gc)');
        }
        this.compactionScheduled = false;
        console.log('Heap compaction completed.');
    }

    /**
     * Simulates low-traffic and high-traffic periods for testing purposes.
     *
     * @param {boolean} isLowTraffic - True for low-traffic period, false otherwise.
     */
    simulateTrafficPeriod(isLowTraffic) {
        this.lowTraffic = () => isLowTraffic;
        console.log(isLowTraffic ? 'Low-traffic period detected.' : 'High-traffic period detected.');
    }
    
    /**
     * Processes large datasets in chunks, with memory optimization during processing if memory exceeds the threshold.
     *
     * @param {Array} dataArray - The data array to process in chunks.
     * @param {function(Array):void} processCallback - Callback to process each chunk.
     * @returns {Promise<void>} A promise resolving when data processing completes.
     */
    async processLargeDataInChunks(dataArray, processCallback) {
        const chunkSize = 1000;
        let index = 0;

        while (index < dataArray.length) {
            const chunk = dataArray.slice(index, index + chunkSize);
            processCallback(chunk); // Process each chunk

            index += chunkSize;

            const memoryUsage = this.getMemoryUsage();
            console.log(`Memory usage during processing: ${Math.round(memoryUsage / 1024 / 1024)} MB`);

            if (memoryUsage > this.memoryThreshold && this.lowTraffic()) {
                console.log('High memory usage detected, optimizing memory...');
                this.optimizeMemory();
            }

            // Allow async processing without blocking the main thread
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
    }
}

export default MemoryManager;