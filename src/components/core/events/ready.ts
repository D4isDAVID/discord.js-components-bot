import { Events } from 'discord.js';
import { BotEvent } from '../../../interfaces/bot-component-data.js';

export default {
    type: 'on',
    name: Events.ClientReady,
    async execute(client) {
        console.log(`Ready as ${client.user.tag}!`);
    },
} as BotEvent<Events.ClientReady>;
