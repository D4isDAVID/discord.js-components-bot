import { ComponentType, MessageFlags } from '@discordjs/core';
import { UserSelect } from '../../data.js';

export const exampleUserSelect = {
    data: {
        type: ComponentType.UserSelect,
        custom_id: 'user_select_example',
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The user is: <@${interaction.data.values[0]!}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies UserSelect;
