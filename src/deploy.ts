import { Events } from 'discord.js';
import BotClient from './structures/bot-client.js';

import dotenv from 'dotenv';
dotenv.config();

const client = new BotClient({ intents: [] });
await client.loadComponents(false);

process.stdout.write('Collecting commands... ');
const commands = Array.from(client.commands, (entry) => {
    return entry[1].data;
});
console.log('Done!');

client.on(Events.ClientReady, async () => {
    process.stdout.write('Deploying commands... ');
    await client.application?.commands.set(commands).then(() => {
        console.log('Done!');
        client.destroy();
    });
});

await client.login(process.env.BOT_TOKEN);
