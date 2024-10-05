/**
 * The `MemoryProfiler` class tracks memory usage for ongoing operations, learns memory 
 * patterns over time and triggers alerts when memory usage exceeds a defined threshold. 
 * It provides insights into memory consumption patterns and suggests optimizations based on 
 * historical data.
 *
 * This class supports usage in both browser and Node.js environments.
 *
 * The class supports:
 * - Registering operations for real-time memory monitoring.
 * - Learning memory usage patterns and calculating averages.
 * - Triggering alerts when memory usage crosses a set threshold.
 * - Storing memory history for analysis.
 *
 * General Parameters:
 * @param {string} operationName - The name of the operation to track memory usage for.
 * @param {function(number): void} [callback] - An optional callback function that receives the memory usage in bytes.
 *
 * General Return Values:
 * @returns {symbol} - A unique identifier for the registered operation tracking its memory usage.
 *
 * This class is helpful for scenarios where understanding and optimizing memory consumption 
 * is critical, such as in high-performance applications or long-running processes.
 */
class MemoryProfiler {
    /**
     * Initializes the MemoryProfiler with a memory threshold for alerts and sets up 
     * tracking for ongoing operations and memory usage history.
     */
    constructor() {
        /**
         * @type {Map<symbol, {operationName: string, startTime: number, memoryUsage: number}>}
         * @description Stores ongoing operations and their memory usage.
         */
        this.operations = new Map();

        /**
         * @type {Array<{time: number, memoryUsage: number}>}
         * @description Stores memory usage history for analysis over time.
         */
        this.memoryHistory = [];

        /**
         * @type {number}
         * @description The default memory usage threshold (in bytes) for triggering alerts. Default is 150 MB.
         */
        this.alertThreshold = 150 * 1024 * 1024;

        /**
         * @type {Object<string, number[]>}
         * @description Stores learned memory usage patterns for various operations.
         */
        this.learnedPatterns = {};
    }

    /**
     * Registers an operation to monitor its memory usage. 
     * Memory profiling starts immediately for the registered operation.
     *
     * @param {string} operationName - The name of the operation to track.
     * @param {function(number):void} [callback] - Optional callback that receives the memory usage.
     * @returns {symbol} A unique identifier for the registered operation.
     */
    registerOperation(operationName, callback) {
        const operationId = Symbol(); // Unique ID for the operation
        this.operations.set(operationId, { operationName, startTime: Date.now() });

        // Start memory profiling for this operation
        this.monitorMemory(operationId, callback);

        return operationId;
    }

    /**
     * Monitors memory usage for the specified operation. Memory usage data is tracked 
     * and can trigger alerts if usage exceeds the defined threshold.
     *
     * @param {symbol} operationId - The unique identifier for the operation.
     * @param {function(number):void} [callback] - Optional callback that receives the memory usage.
     */
    monitorMemory(operationId, callback) {
        let memoryUsage;

        if (typeof process !== 'undefined' && process.memoryUsage) {
            // Node.js environment
            memoryUsage = process.memoryUsage().heapUsed;
        } else if (typeof performance !== 'undefined' && performance.memory) {
            // Browser environment
            memoryUsage = performance.memory.usedJSHeapSize;
        } else {
            console.warn("Memory profiling is not supported in this environment.");
            return;
        }

        const operation = this.operations.get(operationId);

        if (operation) {
            this.operations.set(operationId, { ...operation, memoryUsage });

            // Learn memory patterns over time
            this.learnMemoryPattern(operation.operationName, memoryUsage);

            // Call the callback with the updated memory usage
            if (callback) {
                callback(memoryUsage);
            }

            // Store memory history for analysis
            this.memoryHistory.push({ time: Date.now(), memoryUsage });

            // Trigger alert if memory usage exceeds threshold
            if (memoryUsage > this.alertThreshold) {
                this.triggerMemoryAlert(operation.operationName, memoryUsage);
            }
        }
    }

    /**
     * Learns memory usage patterns for the specified operation over time and 
     * suggests optimizations based on collected data.
     *
     * @param {string} operationName - The name of the operation to track memory patterns for.
     * @param {number} memoryUsage - The memory usage in bytes.
     */
    learnMemoryPattern(operationName, memoryUsage) {
        if (!this.learnedPatterns[operationName]) {
            this.learnedPatterns[operationName] = [];
        }

        // Track memory usage for the specific operation
        this.learnedPatterns[operationName].push(memoryUsage);

        // Analyze patterns and suggest optimizations (abstract)
        if (this.learnedPatterns[operationName].length > 5) { // Example threshold
            const avgUsage = this.getAverageMemoryUsage(this.learnedPatterns[operationName]);
            console.log(`Learned pattern for ${operationName}: Avg memory usage: ${avgUsage} MB`);
        }
    }

    /**
     * Calculates the average memory usage from a set of memory usage data points.
     *
     * @param {number[]} memoryUsages - An array of memory usage values in bytes.
     * @returns {number} The average memory usage in megabytes.
     */
    getAverageMemoryUsage(memoryUsages) {
        const totalUsage = memoryUsages.reduce((sum, usage) => sum + usage, 0);
        return (totalUsage / memoryUsages.length) / (1024 * 1024); // Convert to MB
    }

    /**
     * Triggers a memory alert if memory usage for an operation exceeds the defined threshold.
     *
     * @param {string} operationName - The name of the operation that triggered the alert.
     * @param {number} memoryUsage - The memory usage in bytes.
     */
    triggerMemoryAlert(operationName, memoryUsage) {
        console.warn(`Memory alert! ${operationName} is using ${Math.round(memoryUsage / 1024 / 1024)} MB`);
        // Optionally add custom logic to handle memory alerts
    }

    /**
     * Completes the specified operation and cleans up any associated memory usage tracking.
     *
     * @param {symbol} operationId - The unique identifier for the completed operation.
     */
    completeOperation(operationId) {
        const operation = this.operations.get(operationId);
        if (operation) {
            const endTime = Date.now();
            const elapsedTime = endTime - operation.startTime;
            console.log(`Operation ${operation.operationName} completed in ${elapsedTime} ms`);

            // Remove the operation from tracking
            this.operations.delete(operationId);
        }
    }

    /**
     * Analyzes the memory usage history for insights and patterns.
     */
    analyzeMemoryHistory() {
        console.log('Memory history:', this.memoryHistory);
        // Further analysis logic can go here
    }
}

export default MemoryProfiler;
