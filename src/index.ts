import {
    ApplicationCommandType,
    GatewayDispatchEvents,
    InteractionType,
} from '@discordjs/core';
import { URL } from 'node:url';
import loadComponents from './components/loader.js';
import { client, exitOnInteractionError, gateway } from './utils/env.js';

const { commands, messageComponents, modals } = await loadComponents(
    new URL('./components', import.meta.url),
    client
);

const throwOrLogInteractionError = (err: unknown) => {
    if (exitOnInteractionError) throw err;
    else console.error(err);
};

// Interaction handler
client.on(GatewayDispatchEvents.InteractionCreate, async (props) => {
    const { data: interaction } = props;

    switch (interaction.type) {
        case InteractionType.ApplicationCommand:
        case InteractionType.ApplicationCommandAutocomplete:
            const command = commands.get(interaction.data.name);
            if (interaction.type === InteractionType.ApplicationCommand) {
                if (
                    (command?.data.type ?? ApplicationCommandType.ChatInput) ===
                    interaction.data.type
                )
                    await command
                        //@ts-expect-error
                        ?.execute(props)
                        .catch(throwOrLogInteractionError);
            } else if (command?.autocomplete)
                await command
                    //@ts-expect-error
                    ?.autocomplete(props)
                    .catch(throwOrLogInteractionError);
            break;
        case InteractionType.MessageComponent:
            const component = messageComponents.get(interaction.data.custom_id);
            if (component?.data.type === interaction.data.component_type)
                await component
                    //@ts-expect-error
                    ?.execute(props)
                    .catch(throwOrLogInteractionError);
            break;
        case InteractionType.ModalSubmit:
            const modal = modals.get(interaction.data.custom_id);
            //@ts-expect-error
            await modal?.execute(props).catch(throwOrLogInteractionError);
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
