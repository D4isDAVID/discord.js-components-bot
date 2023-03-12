import { ComponentType, TextInputStyle } from 'discord.js';
import { BotModal } from '../../interfaces/bot-component-data.js';

export default {
    data: {
        customId: 'example',
        title: 'Example modal',
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        customId: 'message',
                        label: 'Message',
                        placeholder: 'Enter a message to be sent by the bot!',
                        style: TextInputStyle.Paragraph,
                        maxLength: 2000,
                        required: true,
                    },
                ],
            },
        ],
    },
    async execute(interaction) {
        const content = interaction.fields.getTextInputValue('message');
        await interaction.reply({ content, ephemeral: true });
    },
} as BotModal;
