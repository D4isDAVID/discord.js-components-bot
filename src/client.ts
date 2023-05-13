import { API, Client } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { botToken, shardCount } from './env.js';

const rest = new REST({ version: '10' }).setToken(botToken);
const gateway = new WebSocketManager({
    token: botToken,
    intents: 0,
    rest,
    shardCount,
});

const api = new API(rest);
const client = new Client({ rest, gateway });

export { rest, gateway, api, client };
