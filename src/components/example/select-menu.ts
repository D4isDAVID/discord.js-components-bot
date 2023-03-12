import {
    ComponentType,
    StringSelectMenuComponentData,
    StringSelectMenuInteraction,
} from 'discord.js';
import { BotMessageComponent } from '../../interfaces/bot-component-data.js';
import button from './button.js';

export default {
    data: {
        type: ComponentType.StringSelect,
        customId: 'select_menu_example',
        placeholder: 'What should I do?',
        options: [
            {
                value: 'button',
                label: 'Show me a cool button!',
            },
        ],
        maxValues: 1,
    } as StringSelectMenuComponentData,
    async execute(interaction: StringSelectMenuInteraction) {
        await interaction.update({});
        switch (interaction.values[0]) {
            case 'button':
                await interaction.followUp({
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [button.data],
                        },
                    ],
                    ephemeral: true,
                });
                break;
            default:
                break;
        }
    },
} as BotMessageComponent;
