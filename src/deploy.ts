import { Client, GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { env, stdout } from 'node:process';
import { URL } from 'node:url';
import loadComponents from './components-loader.js';

import dotenv from 'dotenv';
dotenv.config();

const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN!);
const ws = new WebSocketManager({
    token: env.BOT_TOKEN!,
    intents: 0,
    rest,
});

const client = new Client({ rest, ws });
const interactions = await loadComponents(
    new URL('./components', import.meta.url)
);

stdout.write('Collecting commands... ');
const commands = Array.from(interactions.commands, (entry) => {
    return entry[1].data;
});
console.log('Done!');

client.on(GatewayDispatchEvents.Ready, async ({ api, data }) => {
    stdout.write('Deploying commands... ');
    api.applicationCommands
        .bulkOverwriteGlobalCommands(data.application.id, commands)
        .then(() => {
            console.log('Done!');
            ws.destroy();
        });
});

await ws.connect();
