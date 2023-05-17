import { ButtonStyle, ComponentType } from '@discordjs/core';
import { Button } from '../../component-data.js';
import modal from './modal.js';

export default {
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
            modal.data
        );
    },
} satisfies Button;
