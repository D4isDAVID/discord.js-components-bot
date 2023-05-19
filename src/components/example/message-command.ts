import { ApplicationCommandType, MessageFlags } from '@discordjs/core';
import { MessageCommand } from '../data.js';

export default {
    data: {
        name: 'message_example',
        type: ApplicationCommandType.Message,
    },
    async execute({ api, data: interaction }) {
        const message =
            interaction.data.resolved.messages[interaction.data.target_id];

        const content = message
            ? `The message says: ${message?.content}`
            : "Somehow couldn't find the message.";

        await api.interactions.reply(interaction.id, interaction.token, {
            content,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies MessageCommand;
