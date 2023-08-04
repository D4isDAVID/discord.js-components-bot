import { ApplicationCommandType, MessageFlags } from '@discordjs/core';
import { UserCommand } from '../../data.js';

export default {
    data: {
        name: 'user_example',
        type: ApplicationCommandType.User,
    },
    async execute({ api, data: interaction }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The user is: <@${interaction.data.target_id}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies UserCommand;
