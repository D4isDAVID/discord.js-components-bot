import { GatewayDispatchEvents } from '@discordjs/core';
import { BotEvent } from '../../../bot/component-data.js';

export default {
    type: 'once',
    name: GatewayDispatchEvents.Ready,
    async execute({ data }) {
        const { user } = data;
        console.log(`Ready as ${user.username}#${user.discriminator}`);
    },
} as BotEvent<GatewayDispatchEvents.Ready>;
