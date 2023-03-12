import BotClient from './structures/bot-client.js';

import dotenv from 'dotenv';
dotenv.config();

const client = new BotClient({ intents: [] });
await client.loadComponents();
await client.login(process.env.BOT_TOKEN);
