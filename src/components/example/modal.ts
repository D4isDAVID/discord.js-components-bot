import { ComponentType, MessageFlags, TextInputStyle } from '@discordjs/core';
import { Modal } from '../types.js';
import { mapModalTextInputValues } from '/utils/interactions.js';

export const exampleModal = {
    data: {
        custom_id: 'example',
        title: 'Example modal',
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        custom_id: 'content',
                        label: 'Message Content',
                        placeholder:
                            'The message content to be sent by the bot',
                        style: TextInputStyle.Paragraph,
                        max_length: 2000,
                        required: true,
                    },
                ],
            },
        ],
    },
    async execute({ data: interaction, api }) {
        const { content } = mapModalTextInputValues(interaction.data);

        await api.interactions.reply(interaction.id, interaction.token, {
            content,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies Modal;
