import { ApplicationCommandOptionType, MessageFlags } from '@discordjs/core';
import {
    Subcommand,
    createSubcommandGroup,
    createSubcommandsCommand,
} from '../../subcommands.js';

const exampleSubcommand = {
    data: {
        name: 'subcommand',
        description: 'An example subcommand',
        type: ApplicationCommandOptionType.Subcommand,
    },
    async execute({ api, data: interaction }) {
        api.interactions.reply(interaction.id, interaction.token, {
            content: 'Example message',
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies Subcommand;

export default createSubcommandsCommand(
    {
        name: 'subcommands',
        description: 'An example command with subcommands',
    },
    [
        createSubcommandGroup(
            {
                name: 'group',
                description: 'An example subcommand group',
                type: ApplicationCommandOptionType.SubcommandGroup,
            },
            [exampleSubcommand],
        ),
        exampleSubcommand,
    ],
);
