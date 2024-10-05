/**
 * The `AsyncDomManager` class is responsible for managing asynchronous operations 
 * related to DOM elements. It ensures that memory is properly managed by tracking 
 * asynchronous operations and cleaning up DOM elements once the operations are complete.
 *
 * The class supports:
 * - Registering asynchronous operations linked to specific DOM elements.
 * - Cleaning up DOM elements and releasing associated memory when the operation completes.
 * - Providing custom cleanup functions for DOM elements.
 * - Clearing all registered asynchronous operations and DOM elements.
 *
 * General Parameters:
 * @param {Promise} promise - The promise representing the asynchronous operation.
 * @param {HTMLElement} element - The DOM element linked to the asynchronous operation.
 * @param {function(HTMLElement): void} [cleanupFunction] - An optional custom cleanup function for the DOM element.
 *
 * General Return Values:
 * @returns {void} - No direct return value, but logs cleanup actions to the console.
 *
 * This class is beneficial for efficiently managing DOM elements in applications 
 * with heavy asynchronous interactions, preventing memory leaks and ensuring proper DOM cleanup.
 */
class AsyncDomManager {

    /**
     * Initializes the AsyncDomManager with a map to track asynchronous operations.
     */
    constructor() {
        /**
         * @type {Map<symbol, {promise: Promise, element: HTMLElement, cleanupFunction: function}>}
         * @description Tracks async operations and associated DOM elements.
         */
        this.operations = new Map(); // Track asynchronous operations
    }

    /**
     * Registers an asynchronous operation and links it to a DOM element.
     * When the operation completes, the associated DOM element will be cleaned up.
     *
     * @param {Promise} promise - The promise representing the asynchronous operation.
     * @param {HTMLElement} element - The DOM element associated with the async operation.
     * @param {function(HTMLElement):void} [cleanupFunction] - A custom cleanup function for the element.
     */
    registerAsyncOperation(promise, element, cleanupFunction) {
        const operationId = Symbol(); // Unique identifier for the operation

        // Store the operation and the associated element
        this.operations.set(operationId, { promise, element, cleanupFunction });

        // When the promise resolves, cleanup and release memory
        promise
            .then(() => this.cleanupOperation(operationId))
            .catch((err) => console.error('Async operation failed:', err));
    }

    /**
     * Cleans up an operation by releasing memory, unmounting the associated DOM element, 
     * and removing the operation from the tracking map.
     *
     * @param {symbol} operationId - The unique identifier for the async operation to clean up.
     */
    cleanupOperation(operationId) {
        const operation = this.operations.get(operationId);

        if (operation) {
            const { element, cleanupFunction } = operation;

            // Perform any custom cleanup provided by the user
            if (cleanupFunction) {
                cleanupFunction(element);
            }

            // Release the DOM element (clear content, remove event listeners)
            this.releaseElement(element);

            // Remove the operation from tracking
            this.operations.delete(operationId);

            console.log('Async operation and DOM element cleaned up');
        }
    }

    /**
     * Releases a DOM element by clearing its content and removing any event listeners.
     *
     * @param {HTMLElement} element - The DOM element to clean up.
     */
    releaseElement(element) {
        if (element) {
            // Remove child elements and event listeners
            element.innerHTML = '';
            const clone = element.cloneNode(); // Remove all listeners
            element.replaceWith(clone);
        }
    }

    /**
     * Clears all registered asynchronous operations, cleaning up the associated DOM elements.
     * This can be useful during application shutdown or when resetting the DOM state.
     */
    clearAllOperations() {
        this.operations.forEach((operation, operationId) => {
            this.cleanupOperation(operationId);
        });
        console.log('All async operations and DOM elements cleaned up');
    }
}

export default AsyncDomManager;