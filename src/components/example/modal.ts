import { ComponentType, TextInputStyle } from 'discord.js';
import { Modal } from '../data.js';

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
    async execute(interaction) {
        await interaction.reply({
            content: interaction.fields.getTextInputValue('content'),
            ephemeral: true,
        });
    },
} satisfies Modal;
