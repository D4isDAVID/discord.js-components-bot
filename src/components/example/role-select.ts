import { ComponentType, MessageFlags } from '@discordjs/core';
import { RoleSelect } from '../data.js';

export default {
    data: {
        type: ComponentType.RoleSelect,
        custom_id: 'role_select_example',
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        const role =
            interaction.data.resolved.roles[interaction.data.values[0]!]!;

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The role is: <@&${role.id}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies RoleSelect;
