import { ButtonStyle, ComponentType } from '@discordjs/core';
import { Button } from '../../data.js';
import { exampleModal } from '../modal.js';

export const exampleButton = {
    data: {
        type: ComponentType.Button,
        custom_id: 'button_example',
        style: ButtonStyle.Primary,
        label: 'Click me!',
    },
    async execute({ data: interaction, api }) {
        await api.interactions.createModal(
            interaction.id,
            interaction.token,
            exampleModal.data,
        );
    },
} satisfies Button;
