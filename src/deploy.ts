import { GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import process from 'node:process';
import BotClient from './bot/client.js';

import dotenv from 'dotenv';
dotenv.config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
const ws = new WebSocketManager({
    token: process.env.BOT_TOKEN!,
    intents: 0,
    rest,
});

const client = new BotClient({ rest, ws });
await client.loadComponents(false);

process.stdout.write('Collecting commands... ');
const commands = Array.from(client.commands, (entry) => {
    return entry[1].data;
});
console.log('Done!');

client.on(GatewayDispatchEvents.Ready, async ({ api, data }) => {
    process.stdout.write('Deploying commands... ');
    api.applicationCommands
        .bulkOverwriteGlobalCommands(data.application.id, commands)
        .then(() => {
            console.log('Done!');
            ws.destroy();
        });
});

await ws.connect();
