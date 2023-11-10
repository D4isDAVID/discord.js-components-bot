import { ComponentType } from 'discord.js';
import { ChatInputCommand } from '../../data.js';
import stringSelect, { options } from '../message-components/string-select.js';

export default {
    data: {
        name: 'example',
        description: 'Example command',
    },
    async execute(interaction) {
        const stringSelectData = { ...stringSelect.data };

        if (!interaction.inGuild())
            stringSelectData.options = stringSelectData.options.filter(
                (option) => !options[option.value]?.guildBased,
            );

        await interaction.reply({
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [stringSelectData],
                },
            ],
            ephemeral: true,
        });
    },
} satisfies ChatInputCommand;
