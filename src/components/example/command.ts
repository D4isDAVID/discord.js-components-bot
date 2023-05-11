import {
    APIChatInputApplicationCommandInteraction,
    ComponentType,
    MessageFlags,
} from '@discordjs/core';
import { BotCommand } from '../../component-data.js';
import selectMenu from './select-menu.js';

export default {
    data: {
        name: 'example',
        description: 'Example command',
    },
    async execute({ api, data: interaction }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [selectMenu.data],
                },
            ],
            flags: MessageFlags.Ephemeral,
        });
    },
} as BotCommand<APIChatInputApplicationCommandInteraction>;
