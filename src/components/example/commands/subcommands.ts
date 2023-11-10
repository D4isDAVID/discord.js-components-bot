import { ApplicationCommandOptionType } from 'discord.js';
import {
    Subcommand,
    createSubcommandGroup,
    createSubcommandsCommand,
} from '../../subcommands.js';

export default createSubcommandsCommand(
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
                    async execute(interaction) {
                        await interaction.reply({
                            content: `You ran the \`${interaction.options.getSubcommand()}\` subcommand inside the \`${interaction.options.getSubcommandGroup()}\` group!`,
                            ephemeral: true,
                        });
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
            async execute(interaction) {
                await interaction.reply({
                    content: `You ran the \`${interaction.options.getSubcommand()}\` subcommand!`,
                    ephemeral: true,
                });
            },
        } satisfies Subcommand,
    ],
);
