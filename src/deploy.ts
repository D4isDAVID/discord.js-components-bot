import { stdout } from 'node:process';
import loadComponents, { commands } from './components/loader.js';
import { api } from './env.js';

await loadComponents();

stdout.write('Fetching application info... ');
const { id } = await api.oauth2.getCurrentBotApplicationInformation();
console.log('Done!');

stdout.write('Deploying commands... ');
await api.applicationCommands.bulkOverwriteGlobalCommands(id, commands);
console.log('Done!');
