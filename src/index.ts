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
await client.loadComponents();

await ws.connect();
