import { ButtonStyle, ComponentType } from 'discord.js';
import { Button } from '../../data.js';
import modal from '../modal.js';

export default {
    data: {
        type: ComponentType.Button,
        custom_id: 'button_example',
        style: ButtonStyle.Primary,
        label: 'Click me!',
    },
    async execute(interaction) {
        await interaction.showModal(modal.data);
    },
} satisfies Button;
