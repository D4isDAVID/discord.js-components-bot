import { ComponentType, MessageFlags } from '@discordjs/core';
import { RoleSelect } from '/components/types.js';

export const exampleRoleSelect = {
    data: {
        type: ComponentType.RoleSelect,
        custom_id: 'role_select_example',
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The role is: <@&${interaction.data.values[0]!}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies RoleSelect;
