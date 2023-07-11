import { ComponentType, MessageFlags } from '@discordjs/core';
import { ChatInputCommand } from '../../data.js';
import stringSelect, { options } from '../message-components/string-select.js';

export default {
    data: {
        name: 'example',
        description: 'Example command',
    },
    async execute({ api, data: interaction }) {
        const { data: stringSelectData } = stringSelect;

        if (!interaction.guild_id)
            stringSelectData.options = stringSelectData.options.filter(
                (option) => !options[option.value]?.guildBased,
            );

        await api.interactions.reply(interaction.id, interaction.token, {
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [stringSelectData],
                },
            ],
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies ChatInputCommand;
