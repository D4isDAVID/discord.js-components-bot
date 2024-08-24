import { ComponentType, MessageFlags } from '@discordjs/core';
import {
    exampleStringSelect,
    options,
} from '../message-components/string-select.js';
import { ChatInputCommand } from '/components/types.js';

export const exampleChatInputCommand = {
    data: {
        name: 'example',
        description: 'Example command',
    },
    async execute({ api, data: interaction }) {
        const stringSelectData = { ...exampleStringSelect.data };

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
