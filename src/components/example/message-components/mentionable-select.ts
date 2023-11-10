import { ComponentType } from 'discord.js';
import { MentionableSelect } from '../../data.js';

export default {
    data: {
        type: ComponentType.MentionableSelect,
        custom_id: 'mentionable_select_example',
        max_values: 1,
    },
    async execute(interaction) {
        const isRole = Boolean(interaction.roles.get(interaction.values[0]!));

        await interaction.reply({
            content: `The ${isRole ? 'role' : 'user'} is: <@${
                isRole ? '&' : ''
            }${interaction.values[0]}>`,
            ephemeral: true,
        });
    },
} satisfies MentionableSelect;
