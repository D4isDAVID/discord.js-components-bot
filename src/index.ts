import { GatewayDispatchEvents, InteractionType } from '@discordjs/core';
import { URL } from 'node:url';
import { client, gateway } from './client.js';
import loadComponents from './component-loader.js';

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
            await command
                ?.execute({ ...props, data: interaction })
                .catch(console.error);
            break;
        case InteractionType.ApplicationCommandAutocomplete:
            const autocompleteCommand = commands.get(interaction.data.name);
            if (!autocompleteCommand?.autocomplete) break;
            await autocompleteCommand
                ?.autocomplete({
                    ...props,
                    data: interaction,
                })
                .catch(console.error);
            break;
        case InteractionType.MessageComponent:
            const component = messageComponents.get(interaction.data.custom_id);
            if (component?.data.type === interaction.data.component_type)
                await component
                    ?.execute({
                        ...props,
                        data: interaction,
                    })
                    .catch(console.error);
            break;
        case InteractionType.ModalSubmit:
            const modal = modals.get(interaction.data.custom_id);
            await modal
                ?.execute({ ...props, data: interaction })
                .catch(console.error);
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
