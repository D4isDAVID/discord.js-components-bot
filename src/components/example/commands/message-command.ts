import { ApplicationCommandType, messageLink } from 'discord.js';
import { MessageCommand } from '../../data.js';

export default {
    data: {
        name: 'message_example',
        type: ApplicationCommandType.Message,
    },
    async execute(interaction) {
        await interaction.reply({
            content: `The message is: ${messageLink(
                interaction.channelId,
                interaction.targetId,
            )}`,
            ephemeral: true,
        });
    },
} satisfies MessageCommand;
