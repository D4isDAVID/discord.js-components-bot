import { ComponentType, MessageFlags, TextInputStyle } from '@discordjs/core';
import { BotModal } from '../../component-data.js';

export default {
    data: {
        custom_id: 'example',
        title: 'Example modal',
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        custom_id: 'message',
                        label: 'Message',
                        placeholder: 'Enter a message to be sent by the bot!',
                        style: TextInputStyle.Paragraph,
                        max_length: 2000,
                        required: true,
                    },
                ],
            },
        ],
    },
    async execute({ data: interaction, api }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: interaction.data.components[0]?.components[0]?.value,
            flags: MessageFlags.Ephemeral,
        });
    },
} as BotModal;
