import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { env, stdout } from 'node:process';
import { URL } from 'node:url';
import loadComponents from './component-loader.js';

import dotenv from 'dotenv';
dotenv.config();

const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN!);

const api = new API(rest);
const interactions = await loadComponents(
    new URL('./components', import.meta.url)
);

stdout.write('Collecting commands... ');
const commands = Array.from(interactions.commands, (entry) => {
    return entry[1].data;
});
console.log('Done!');

stdout.write('Fetching application info... ');
const application = await api.oauth2.getCurrentBotApplicationInformation();
console.log('Done!');

stdout.write('Deploying commands... ');
await api.applicationCommands.bulkOverwriteGlobalCommands(
    application.id,
    commands
);
console.log('Done!');
