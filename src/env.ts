import { Client } from 'discord.js';
import { env } from 'node:process';

const toEnvBool = (str?: string) => (str === 'false' ? false : Boolean(str));

export const botToken = env.BOT_TOKEN ?? '';
export const shardCount = env.BOT_SHARD_COUNT
    ? parseInt(env.BOT_SHARD_COUNT)
    : null;
export const exitOnEventError = toEnvBool(env.EXIT_ON_EVENT_ERROR);

export const client = new Client({
    rest: { version: '10' },
    shards: shardCount ?? 'auto',
    intents: [],
});
