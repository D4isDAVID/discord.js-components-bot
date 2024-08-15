import {
    APIMessageActionRowComponent,
    ComponentType,
    MessageFlags,
} from '@discordjs/core';
import { StringSelect } from '../../data.js';
import { exampleButton } from './button.js';
import { exampleChannelSelect } from './channel-select.js';
import { exampleMentionableSelect } from './mentionable-select.js';
import { exampleRoleSelect } from './role-select.js';
import { exampleUserSelect } from './user-select.js';

export const options: Record<
    string,
    {
        label: string;
        description: string;
        data: APIMessageActionRowComponent;
        guildBased?: boolean;
    }
> = {
    button: {
        label: 'Button',
        description: 'Show me a cool button!',
        data: exampleButton.data,
    },
    user_select: {
        label: 'User Select Menu',
        description: 'Show me a cool user select menu!',
        data: exampleUserSelect.data,
    },
    role_select: {
        label: 'Role Select Menu',
        description: 'Show me a cool role select menu!',
        data: exampleRoleSelect.data,
        guildBased: true,
    },
    mentionable_select: {
        label: 'Mentionable Select Menu',
        description: 'Show me a cool mentionable select menu!',
        data: exampleMentionableSelect.data,
    },
    channel_select: {
        label: 'Channel Select Menu',
        description: 'Show me a cool channel select menu!',
        data: exampleChannelSelect.data,
        guildBased: true,
    },
};

export const exampleStringSelect = {
    data: {
        type: ComponentType.StringSelect,
        custom_id: 'string_select_example',
        placeholder: 'What should I do?',
        options: Object.entries(options).map(
            ([value, { label, description }]) => ({
                label,
                value,
                description,
            }),
        ),
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        await api.interactions.updateMessage(
            interaction.id,
            interaction.token,
            {},
        );

        let component: APIMessageActionRowComponent | undefined =
            options[interaction.data.values[0]!]?.data;

        if (component)
            await api.interactions.followUp(
                interaction.application_id,
                interaction.token,
                {
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [component],
                        },
                    ],
                    flags: MessageFlags.Ephemeral,
                },
            );
    },
} satisfies StringSelect;
