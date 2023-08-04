import { ComponentType, MessageFlags } from '@discordjs/core';
import { MentionableSelect } from '../../data.js';

export default {
    data: {
        type: ComponentType.MentionableSelect,
        custom_id: 'mentionable_select_example',
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        const isRole = Boolean(interaction.data.resolved.roles);

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The ${isRole ? 'role' : 'user'} is: <@${
                isRole ? '&' : ''
            }${interaction.data.values[0]!}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies MentionableSelect;
