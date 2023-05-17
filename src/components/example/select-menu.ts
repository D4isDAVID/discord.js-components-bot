import { ComponentType, MessageFlags } from '@discordjs/core';
import { StringSelect } from '../../component-data.js';
import button from './button.js';

export default {
    data: {
        type: ComponentType.StringSelect,
        custom_id: 'select_menu_example',
        placeholder: 'What should I do?',
        options: [
            {
                value: 'button',
                label: 'Show me a cool button!',
            },
        ],
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        await api.interactions.updateMessage(
            interaction.id,
            interaction.token,
            {}
        );
        switch (interaction.data.values[0]) {
            case 'button':
                await api.interactions.followUp(
                    interaction.application_id,
                    interaction.token,
                    {
                        components: [
                            {
                                type: ComponentType.ActionRow,
                                components: [button.data],
                            },
                        ],
                        flags: MessageFlags.Ephemeral,
                    }
                );
                break;
            default:
                break;
        }
    },
} satisfies StringSelect;
