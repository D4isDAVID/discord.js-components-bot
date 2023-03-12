import {
    ButtonComponentData,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
} from 'discord.js';
import { BotMessageComponent } from '../../interfaces/bot-component-data.js';
import modal from './modal.js';

export default {
    data: {
        type: ComponentType.Button,
        customId: 'button_example',
        style: ButtonStyle.Primary,
        label: 'Click me!',
    } as ButtonComponentData,
    async execute(interaction: ButtonInteraction) {
        await interaction.showModal(modal.data);
    },
} as BotMessageComponent;
