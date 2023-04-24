import { GatewayDispatchEvents, InteractionType } from '@discordjs/core';
import { BotEvent } from '../../../bot/component-data.js';

export default {
    type: 'on',
    name: GatewayDispatchEvents.InteractionCreate,
    async execute(props) {
        const { data: interaction, client } = props;

        switch (interaction.type) {
            case InteractionType.ApplicationCommand:
                const command = client.commands.get(interaction.data.name);
                await command?.execute({ ...props, data: interaction });
                break;
            case InteractionType.ApplicationCommandAutocomplete:
                const autocomplete = client.commands.get(interaction.data.name);
                if (!autocomplete?.autocomplete) break;
                await autocomplete?.autocomplete({
                    ...props,
                    data: interaction,
                });
                break;
            case InteractionType.MessageComponent:
                const component = client.messageComponents.get(
                    interaction.data.custom_id
                );
                if (component?.data.type === interaction.data.component_type)
                    await component?.execute({ ...props, data: interaction });
                break;
            case InteractionType.ModalSubmit:
                const modal = client.modals.get(interaction.data.custom_id);
                await modal?.execute({ ...props, data: interaction });
                break;
            default:
                break;
        }
    },
} as BotEvent<GatewayDispatchEvents.InteractionCreate>;
