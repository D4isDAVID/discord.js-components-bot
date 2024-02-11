import { loadComponents } from './components/loader.js';
import { gateway } from './env.js';

await loadComponents();

console.log('Connecting to the Discord gateway...');
await gateway.connect();
