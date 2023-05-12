import { env } from 'node:process';

import dotenv from 'dotenv';
dotenv.config();

export const botToken = env.BOT_TOKEN ?? '';
export const shardCount = env.SHARD_COUNT ? parseInt(env.SHARD_COUNT) : null;
