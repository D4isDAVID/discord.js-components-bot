import { ApplicationCommandType, MessageFlags } from '@discordjs/core';
import { messageLink } from '@discordjs/formatters';
import { MessageCommand } from '/components/types.js';

export const exampleMessageCommand = {
    data: {
        name: 'Message Example',
        type: ApplicationCommandType.Message,
    },
    async execute({ api, data: interaction }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The message is: ${messageLink(
                interaction.channel.id,
                interaction.data.target_id,
            )}`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies MessageCommand;
