import { ApplicationCommandType } from '@discordjs/core';
import { UserCommand } from '../../data.js';
import { exampleStatefulModal } from './stateful-modal.js';

export const exampleCommandWithStatefulModal = {
    data: {
        type: ApplicationCommandType.User,
        name: 'Message',
    },
    async execute({ data: interaction, api }) {
        await api.interactions.createModal(
            interaction.id,
            interaction.token,
            exampleStatefulModal.stateful(interaction.data.target_id),
        );
    },
} satisfies UserCommand;
