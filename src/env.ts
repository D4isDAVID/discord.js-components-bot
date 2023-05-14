import { API, Client } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { env } from 'node:process';

import dotenv from 'dotenv';
dotenv.config();

export const botToken = env.BOT_TOKEN ?? '';
export const shardCount = env.SHARD_COUNT ? parseInt(env.SHARD_COUNT) : null;

export const rest = new REST({ version: '10' }).setToken(botToken);
export const gateway = new WebSocketManager({
    token: botToken,
    intents: 0,
    rest,
    shardCount,
});

export const api = new API(rest);
export const client = new Client({ rest, gateway });
