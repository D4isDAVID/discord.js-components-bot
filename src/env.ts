import { Client } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { env } from 'node:process';

function toEnvBool(str?: string) {
    if (str === 'false') {
        return false;
    }

    return Boolean(str);
}

export const botToken = env.BOT_TOKEN ?? '';
export const shardCount = env.BOT_SHARD_COUNT
    ? parseInt(env.BOT_SHARD_COUNT)
    : null;
export const exitOnEventError = toEnvBool(env.EXIT_ON_EVENT_ERROR);

export const rest = new REST({ version: '10' }).setToken(botToken);
export const gateway = new WebSocketManager({
    token: botToken,
    intents: 0,
    rest,
    shardCount,
});

export const client = new Client({ rest, gateway });
export const api = client.api;
