import { ApplicationCommandType, MessageFlags } from '@discordjs/core';
import { UserCommand } from '../data.js';

export default {
    data: {
        name: 'user_example',
        type: ApplicationCommandType.User,
    },
    async execute({ api, data: interaction }) {
        const { username, discriminator } =
            interaction.data.resolved.users[interaction.data.target_id]!;

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The user is: ${username}${
                discriminator !== '0' ? `#${discriminator}` : ''
            }`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies UserCommand;
