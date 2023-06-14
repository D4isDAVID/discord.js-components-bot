import { ComponentType, MessageFlags } from '@discordjs/core';
import { ChatInputCommand } from '../data.js';
import stringSelect, { options } from './string-select.js';

export default {
    data: {
        name: 'example',
        description: 'Example command',
    },
    async execute({ api, data: interaction }) {
        const { data } = stringSelect;

        if (!interaction.guild_id)
            data.options = data.options.filter(
                (option) => !options[option.value]?.guildBased
            );

        await api.interactions.reply(interaction.id, interaction.token, {
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [data],
                },
            ],
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies ChatInputCommand;
