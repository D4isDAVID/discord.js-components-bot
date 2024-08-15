import { ApplicationCommandOptionType, MessageFlags } from '@discordjs/core';
import {
    Subcommand,
    createSubcommandGroup,
    createSubcommandsCommand,
} from '../../subcommands.js';

export const exampleSubcommandsCommand = createSubcommandsCommand(
    {
        data: {
            name: 'subcommands',
            description: 'An example command with subcommands',
        },
    },
    [
        createSubcommandGroup(
            {
                data: {
                    name: 'group',
                    description: 'An example subcommand group',
                    type: ApplicationCommandOptionType.SubcommandGroup,
                },
            },
            [
                {
                    data: {
                        name: 'subcommand',
                        description: 'An example subcommand',
                        type: ApplicationCommandOptionType.Subcommand,
                    },
                    async execute({
                        api,
                        data: interaction,
                        subcommandGroupData,
                        subcommandData,
                    }) {
                        api.interactions.reply(
                            interaction.id,
                            interaction.token,
                            {
                                content: `You ran the \`${subcommandData.name}\` subcommand inside the \`${subcommandGroupData.name}\` group!`,
                                flags: MessageFlags.Ephemeral,
                            },
                        );
                    },
                },
            ],
        ),
        {
            data: {
                name: 'subcommand',
                description: 'An example subcommand',
                type: ApplicationCommandOptionType.Subcommand,
            },
            async execute({ api, data: interaction, subcommandData }) {
                api.interactions.reply(interaction.id, interaction.token, {
                    content: `You ran the \`${subcommandData.name}\` subcommand!`,
                    flags: MessageFlags.Ephemeral,
                });
            },
        } satisfies Subcommand,
    ],
);
