import { ApplicationCommandType, MessageFlags } from '@discordjs/core';
import { UserCommand } from '../../component-data.js';

export default {
    data: {
        name: 'user_example',
        type: ApplicationCommandType.User,
    },
    async execute({ api, data: interaction }) {
        const user =
            interaction.data.resolved.users[interaction.data.target_id];

        const content = user
            ? `The user is: ${user.username}${
                  user.discriminator !== '0' && '#' + user.discriminator
              }`
            : "Somehow couldn't find the user.";

        await api.interactions.reply(interaction.id, interaction.token, {
            content,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies UserCommand;
