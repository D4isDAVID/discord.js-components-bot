import './components/loader.js';
import { gateway } from './utils/env.js';

console.log('Connecting to the Discord gateway...');
await gateway.connect();
