/**
 * Class responsible for managing reusable DOM elements, optimizing performance by reducing unnecessary DOM manipulations.
 * The class maintains pools of DOM elements by their type and allows for the reuse and release of elements as needed.
 * 
 * @class DomElementManager
 * @description Manages reusable DOM elements to optimize DOM performance. Supports retrieving, releasing, and updating elements in a container, along with clearing element pools.
 * 
 * @method updateContainer
 * Updates a container element with a dynamic list of items, reusing DOM elements when possible to avoid unnecessary DOM manipulations.
 * 
 * @param {HTMLElement} container - The container element to update.
 * @param {Array} items - The list of items to render in the container.
 * @param {string} [elementType='div'] - The type of DOM element to be used for each item.
 * @param {function(HTMLElement, any):void} renderItem - A callback function defining how to render each item.
 */
class DomElementManager {

    constructor() {
        /**
         * @type {Object<string, HTMLElement[]>}
         * @description Stores pools of DOM elements by their type (tag name).
         */
        this.pools = {}; // Pools for different element types
    }

    /**
     * Retrieves or creates a pool for the specified element type.
     *
     * @param {string} elementType - The tag name of the DOM element type (e.g., 'div', 'span').
     * @returns {HTMLElement[]} The pool of reusable elements for the specified type.
     * @private
     */
    _getPool(elementType) {
        if (!this.pools[elementType]) {
            this.pools[elementType] = []; // Initialize pool for element type
        }
        return this.pools[elementType];
    }

    /**
     * Retrieves a DOM element from the pool if available, or creates a new one if the pool is empty.
     *
     * @param {string} [elementType='div'] - The type of the DOM element to retrieve or create.
     * @returns {HTMLElement} A reusable or newly created DOM element.
     */
    getElement(elementType = 'div') {
        const pool = this._getPool(elementType);

        if (pool.length > 0) {
            console.log(`Reusing a ${elementType} element from the pool`);
            return pool.pop(); // Reuse an existing element from the pool
        } else {
            console.log(`Creating a new ${elementType} element`);
            return document.createElement(elementType); // Create a new element if pool is empty
        }
    }

    /**
     * Releases a DOM element back into the pool after cleaning it up for reuse.
     *
     * @param {HTMLElement} element - The DOM element to release back into the pool.
     */
    releaseElement(element) {
        const elementType = element.tagName.toLowerCase();
        const pool = this._getPool(elementType);

        element.innerHTML = ''; 
        element.removeAttribute('class');
        element.removeAttribute('style');

        pool.push(element);
        console.log(`${elementType} element released back to the pool`);
    }

    /**
     * Updates a container element with a dynamic list of items, reusing DOM elements 
     * when possible to avoid unnecessary DOM manipulations.
     *
     * @param {HTMLElement} container - The container element to update.
     * @param {Array} items - The list of items to render in the container.
     * @param {string} [elementType='div'] - The type of element to be used for each item.
     * @param {function(HTMLElement, any):void} renderItem - A function that defines how to render each item.
     */
    updateContainer(container, items, elementType = 'div', renderItem) {
        const existingChildren = Array.from(container.children);
        const pool = this._getPool(elementType);

        items.forEach((item, index) => {
            let element;

            if (index < existingChildren.length) {
                element = existingChildren[index];
            } else {
                element = this.getElement(elementType);
                container.appendChild(element);
            }

            renderItem(element, item);
        });

        while (existingChildren.length > items.length) {
            const extraElement = existingChildren.pop();
            this.releaseElement(extraElement);
            container.removeChild(extraElement);
        }
    }

    /**
     * Clears the pool for a specific element type.
     *
     * @param {string} [elementType='div'] - The type of the DOM element pool to clear.
     */
    clearPool(elementType = 'div') {
        const pool = this._getPool(elementType);
        pool.length = 0; // Clear the pool by resetting its length
        console.log(`${elementType} element pool cleared`);
    }

    /**
     * Clears all pools, removing all reusable DOM elements from memory.
     */
    clearAllPools() {
        this.pools = {};
        console.log('All element pools cleared');
    }
}

export default DomElementManager;
