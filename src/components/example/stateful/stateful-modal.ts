import { ComponentType, TextInputStyle } from '@discordjs/core';
import { Modal } from '/components/types.js';
import { mapModalTextInputValues } from '/utils/interactions.js';
import { createStatefulInteraction } from '/utils/stateful.js';

export const exampleStatefulModal = createStatefulInteraction<Modal>({
    data: {
        custom_id: 'send_user_message',
        title: 'Send message to user',
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        custom_id: 'message',
                        label: 'Message',
                        style: TextInputStyle.Short,
                        required: true,
                    },
                ],
            },
        ],
    },
    async execute({ data: interaction, api, state }) {
        const { message } = mapModalTextInputValues(interaction.data) as {
            message: string;
        };

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `<@${state}>, ${message}`,
        });
    },
});
