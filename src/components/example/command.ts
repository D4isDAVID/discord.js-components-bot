import { ComponentType } from 'discord.js';
import { BotCommand } from '../../interfaces/bot-component-data.js';
import selectMenu from './select-menu.js';

export default {
    data: {
        name: 'example',
        description: 'Example command',
    },
    async execute(interaction) {
        await interaction.reply({
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [selectMenu.data],
                },
            ],
            ephemeral: true,
        });
    },
} as BotCommand;
