import { ApplicationCommandType } from '@discordjs/core';
import { UserCommand } from '../../data.js';
import modal from './stateful-modal.js';

export default {
    data: {
        type: ApplicationCommandType.User,
        name: 'Message',
    },
    async execute({ data: interaction, api }) {
        await api.interactions.createModal(
            interaction.id,
            interaction.token,
            modal.stateful(interaction.data.target_id),
        );
    },
} satisfies UserCommand;
