import { ComponentType, MessageFlags } from '@discordjs/core';
import { MentionableSelect } from '../data.js';

export default {
    data: {
        type: ComponentType.MentionableSelect,
        custom_id: 'mentionable_select_example',
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        const { users, roles } = interaction.data.resolved;
        const value = interaction.data.values[0]!;

        const isRole = Boolean(roles);
        const mentionable = isRole ? roles![value] : users![value];

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The ${isRole ? 'role' : 'user'} is: <@${
                isRole ? '&' : ''
            }${mentionable!.id}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies MentionableSelect;
