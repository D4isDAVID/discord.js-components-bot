import { ButtonStyle, ComponentType } from '@discordjs/core';
import { BotMessageComponent } from '../../component-data.js';
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
} as BotMessageComponent<ComponentType.Button>;
