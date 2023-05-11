import {
    Client,
    GatewayDispatchEvents,
    InteractionType,
} from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { env } from 'node:process';
import { URL } from 'node:url';
import {
    BotMessageComponentInteraction,
    BotMessageComponentType,
} from './component-data.js';
import loadComponents from './component-loader.js';

import dotenv from 'dotenv';
dotenv.config();

const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN!);
const gateway = new WebSocketManager({
    token: env.BOT_TOKEN!,
    intents: 0,
    rest,
});

const client = new Client({ rest, gateway });
const { commands, messageComponents, modals } = await loadComponents(
    new URL('./components', import.meta.url),
    client
);

// Interaction handler
client.on(GatewayDispatchEvents.InteractionCreate, async (props) => {
    const { data: interaction } = props;

    switch (interaction.type) {
        case InteractionType.ApplicationCommand:
            const command = commands.get(interaction.data.name);
            await command?.execute({ ...props, data: interaction, client });
            break;
        case InteractionType.ApplicationCommandAutocomplete:
            const autocompleteCommand = commands.get(interaction.data.name);
            if (!autocompleteCommand?.autocomplete) break;
            await autocompleteCommand?.autocomplete({
                ...props,
                data: interaction,
                client,
            });
            break;
        case InteractionType.MessageComponent:
            const component = messageComponents.get(interaction.data.custom_id);
            if (component?.data.type === interaction.data.component_type)
                await component?.execute({
                    ...props,
                    data: interaction as BotMessageComponentInteraction[BotMessageComponentType],
                    client,
                });
            break;
        case InteractionType.ModalSubmit:
            const modal = modals.get(interaction.data.custom_id);
            await modal?.execute({ ...props, data: interaction, client });
            break;
        default:
            break;
    }
});

client.once(GatewayDispatchEvents.Ready, ({ data }) => {
    const { username, discriminator } = data.user;
    console.log(`Ready as ${username}#${discriminator}!`);
});

console.log('Connecting to the Discord gateway...');
await gateway.connect();
