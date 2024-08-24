import { ApplicationCommandType } from '@discordjs/core';
import { exampleStatefulModal } from './stateful-modal.js';
import { UserCommand } from '/components/types.js';

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
