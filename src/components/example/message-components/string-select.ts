import {
    APIMessageActionRowComponent,
    ComponentType,
    MessageFlags,
} from '@discordjs/core';
import { StringSelect } from '../../data.js';
import button from './button.js';
import channelSelect from './channel-select.js';
import mentionableSelect from './mentionable-select.js';
import roleSelect from './role-select.js';
import userSelect from './user-select.js';

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
        data: button.data,
    },
    user_select: {
        label: 'User Select Menu',
        description: 'Show me a cool user select menu!',
        data: userSelect.data,
    },
    role_select: {
        label: 'Role Select Menu',
        description: 'Show me a cool role select menu!',
        data: roleSelect.data,
        guildBased: true,
    },
    mentionable_select: {
        label: 'Mentionable Select Menu',
        description: 'Show me a cool mentionable select menu!',
        data: mentionableSelect.data,
    },
    channel_select: {
        label: 'Channel Select Menu',
        description: 'Show me a cool channel select menu!',
        data: channelSelect.data,
        guildBased: true,
    },
};

export default {
    data: {
        type: ComponentType.StringSelect,
        custom_id: 'string_select_example',
        placeholder: 'What should I do?',
        options: Object.entries(options).map(
            ([value, { label, description }]) => ({
                label,
                value,
                description,
            })
        ),
        max_values: 1,
    },
    async execute({ api, data: interaction }) {
        await api.interactions.updateMessage(
            interaction.id,
            interaction.token,
            {}
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
                }
            );
    },
} satisfies StringSelect;
