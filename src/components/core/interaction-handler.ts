import {
    ApplicationCommandType,
    GatewayDispatchEvents,
    InteractionType,
} from '@discordjs/core';
import { GatewayEvent } from '../data.js';
import { interactions, statefuls } from '../loader.js';

const findStateful = (id: string, list: string[]): string | void => {
    for (const staticId of list) if (id.startsWith(staticId)) return staticId;
};

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
                const componentId = interaction.data.custom_id;

                let component = interactions.messageComponents.get(componentId);

                if (!component) {
                    const staticId = findStateful(
                        componentId,
                        statefuls.messageComponents,
                    );

                    if (staticId)
                        component =
                            interactions.messageComponents.get(staticId);
                }

                if (!component)
                    throw new Error(
                        `Message component not defined for ${interaction.data.custom_id}.`,
                    );

                if (component.data.type === interaction.data.component_type)
                    //@ts-ignore
                    await component.execute(props);
                break;

            case InteractionType.ModalSubmit:
                const modalId = interaction.data.custom_id;

                let modal = interactions.modals.get(modalId);

                if (!modal) {
                    const staticId = findStateful(modalId, statefuls.modals);

                    if (staticId) modal = interactions.modals.get(staticId);
                }

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
