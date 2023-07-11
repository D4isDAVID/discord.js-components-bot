import {
    ApplicationCommandType,
    GatewayDispatchEvents,
    InteractionType,
} from '@discordjs/core';
import { GatewayEvent } from '../data.js';
import { interactions } from '../loader.js';

export default {
    name: GatewayDispatchEvents.InteractionCreate,
    type: 'on',
    async execute(props) {
        const { data: interaction } = props;

        switch (interaction.type) {
            case InteractionType.ApplicationCommand:
            case InteractionType.ApplicationCommandAutocomplete:
                const command = interactions.commands.get(
                    interaction.data.name,
                );

                if (!command)
                    throw new Error(
                        `Command not defined for ${interaction.data.name}.`,
                    );

                if (
                    interaction.type === InteractionType.ApplicationCommand &&
                    (command.data.type ?? ApplicationCommandType.ChatInput) ===
                        interaction.data.type
                )
                    //@ts-ignore
                    await command.execute(props);
                else if (command.autocomplete)
                    //@ts-ignore
                    await command.autocomplete(props);
                break;

            case InteractionType.MessageComponent:
                const component = interactions.messageComponents.get(
                    interaction.data.custom_id,
                );

                if (!component)
                    throw new Error(
                        `Message component not defined for ${interaction.data.custom_id}.`,
                    );

                if (component.data.type === interaction.data.component_type)
                    //@ts-ignore
                    await component.execute(props);
                break;

            case InteractionType.ModalSubmit:
                const modal = interactions.modals.get(
                    interaction.data.custom_id,
                );

                if (!modal)
                    throw new Error(
                        `Modal not defined for ${interaction.data.custom_id}.`,
                    );

                //@ts-ignore
                await modal.execute(props);
                break;

            default:
                break;
        }
    },
} satisfies GatewayEvent<GatewayDispatchEvents.InteractionCreate>;
