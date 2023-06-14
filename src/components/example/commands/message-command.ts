import { ApplicationCommandType, MessageFlags } from '@discordjs/core';
import { MessageCommand } from '../../data.js';

export default {
    data: {
        name: 'message_example',
        type: ApplicationCommandType.Message,
    },
    async execute({ api, data: interaction }) {
        const { content } =
            interaction.data.resolved.messages[interaction.data.target_id]!;

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The message says: ${content}`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies MessageCommand;
