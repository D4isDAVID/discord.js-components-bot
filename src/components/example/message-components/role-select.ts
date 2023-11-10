import { ComponentType } from 'discord.js';
import { RoleSelect } from '../../data.js';

export default {
    data: {
        type: ComponentType.RoleSelect,
        custom_id: 'role_select_example',
        max_values: 1,
    },
    async execute(interaction) {
        await interaction.reply({
            content: `The role is: <@&${interaction.values[0]}>`,
            ephemeral: true,
        });
    },
} satisfies RoleSelect;
