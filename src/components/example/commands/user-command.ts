import { ApplicationCommandType } from 'discord.js';
import { UserCommand } from '../../data.js';

export default {
    data: {
        name: 'user_example',
        type: ApplicationCommandType.User,
    },
    async execute(interaction) {
        await interaction.reply({
            content: `The user is: <@${interaction.targetId}>`,
            ephemeral: true,
        });
    },
} satisfies UserCommand;
