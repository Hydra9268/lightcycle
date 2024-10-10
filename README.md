# Light Cycle

![Light Cycle logo](https://kxmode.com/images/lightcycle-logo-remix.png)

Light Cycle is an abstraction library designed to optimize browser memory management by minimizing the frequency and impact of garbage collection through more effective resource handling. It focuses on efficiently managing DOM elements and asynchronous operations, helping to prevent memory leaks and reduce browser strain. Inspired by the iconic light cycles in *Tron*, Light Cycle ensures that processes run smoothly and are cleaned up swiftly, improving overall performance. Additionally, it is compatible with Node.js, providing backend solutions to enhance system memory efficiency even further.

## Key Features
- **Abstracted Memory Management**: Light Cycle ensures that all asynchronous DOM operations are monitored and cleaned up after execution, preventing memory leaks.
- **Node.js Compatibility**: Light Cycle works seamlessly with Node.js, enabling efficient resource management both on the client and server side.
- **Improved Performance**: By proactively removing unnecessary DOM elements and event listeners, Light Cycle significantly reduces memory consumption and boosts application performance.

### Project Status: In Development

This project is currently under development. Features, documentation, and overall structure may change as work progresses. Contributions are welcome, but some areas may still be incomplete or evolving.

<!--
## Installation
You can install Light Cycle via npm:

```bash
npm install Lightcycle
```
-->

## Modularity

Light Cycle is designed as a modular package, allowing you to import only the classes you need for your project. Each class is self-contained, making it easy to integrate individual features without importing the entire package.

### Example:

If you only need to use the memory profiling functionality, you can import the corresponding class:

```js
import MemoryProfiler from './mem-profiling-learning/abstract-memory-profiling-and-learning.js';
const memoryProfiler = new MemoryProfiler();
```

This modularity ensures that you can optimize your application by only including the necessary parts of Light Cycle.

All classes:

```js
import MemoryManager from './memory-management/memory-management.js';
import DomElementManager from './dom-element-manager/dom-element-manager.js';
import MemoryProfiler from './mem-profiling-learning/abstract-memory-profiling-and-learning.js';
import AsyncDomManager from './async-mem-dom-manager/async-mem-dom-manager.js';

const memoryManager = new MemoryManager();
const domElementManager = new DomElementManager();
const memoryProfiler = new MemoryProfiler();
const asyncDomManager = new AsyncDomManager();
```

### Example Code:

You can see detailed usage demos in each class's folder.

## Benefits

- **Generalized Memory Management**: 
  Light Cycle is agnostic to the type of DOM element or asynchronous operation, making it applicable across various scenarios, from API calls to user-triggered events and animations.
  
- **Proactive Cleanup**: 
  After every async operation, the associated DOM elements and event listeners are automatically cleaned up to free memory and prevent leaks.
  
- **Prevents Memory Leaks**: 
  Light Cycle helps prevent memory retention by actively managing DOM elements and removing them when they are no longer needed.

## Use Cases

- **Dynamic Content Loading**: Ideal for applications where content is fetched and displayed dynamically (e.g., dashboards, e-commerce).
- **Real-Time Applications**: Ensures efficient memory use in real-time apps (e.g., chat apps, live dashboards).
- **Event-Driven UIs**: Manages memory in UIs that involve async tasks (e.g., form submissions, user-triggered DOM updates).

## Node.js Integration
The MemoryProfiler can be integrated into any Node.js environment, enabling seamless memory usage monitoring and optimization through garbage collection and heap compaction for server and client applications.

## License

```
MIT License

Copyright (c) 2024 Ryan Allen

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
```