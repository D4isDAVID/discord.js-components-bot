import loadComponents from './components/loader.js';
import { botToken, client } from './env.js';

await loadComponents();

console.log('Connecting to the Discord gateway...');
await client.login(botToken);
