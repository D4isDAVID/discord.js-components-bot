import { Events } from 'discord.js';
import { ClientEvent } from '../data.js';

export default {
    name: Events.ClientReady,
    type: 'once',
    async execute(client) {
        const { username, discriminator } = client.user;
        console.log(`Ready as ${username}#${discriminator}!`);
    },
} satisfies ClientEvent<Events.ClientReady>;
