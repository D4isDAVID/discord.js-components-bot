import { stdout } from 'node:process';
import { commands } from './components/loader.js';
import { api } from './utils/env.js';

stdout.write('Fetching application info... ');
const application = await api.oauth2.getCurrentBotApplicationInformation();
console.log('Done!');

stdout.write('Deploying commands... ');
await api.applicationCommands.bulkOverwriteGlobalCommands(
    application.id,
    commands
);
console.log('Done!');
