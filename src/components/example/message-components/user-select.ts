import { ComponentType } from 'discord.js';
import { UserSelect } from '../../data.js';

export default {
    data: {
        type: ComponentType.UserSelect,
        custom_id: 'user_select_example',
        max_values: 1,
    },
    async execute(interaction) {
        await interaction.reply({
            content: `The user is: <@${interaction.values[0]}>`,
            ephemeral: true,
        });
    },
} satisfies UserSelect;
