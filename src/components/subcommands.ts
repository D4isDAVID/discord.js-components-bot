import {
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandSubcommandOption,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Collection,
} from 'discord.js';
import { ChatInputCommand } from './data.js';

interface ISubcommandOrGroup<
    T extends
        | APIApplicationCommandSubcommandOption
        | APIApplicationCommandSubcommandGroupOption,
> {
    readonly data: T;
    readonly execute: (
        interaction: ChatInputCommandInteraction,
    ) => Promise<void>;
    readonly autocomplete?: (
        interaction: AutocompleteInteraction,
    ) => Promise<void>;
}

type Subcommand = ISubcommandOrGroup<APIApplicationCommandSubcommandOption>;
type SubcommandGroup =
    ISubcommandOrGroup<APIApplicationCommandSubcommandGroupOption>;

// Bunch of duplicate code below because these types are too complicated for me

const createSubcommandGroup = (
    group: Partial<SubcommandGroup> & Pick<SubcommandGroup, 'data'>,
    subcommandsArray: Subcommand[],
) => {
    const subcommands = new Collection<string, Subcommand>();
    group.data.options = [];

    subcommandsArray.map((subcommand) => {
        subcommands.set(subcommand.data.name, subcommand);
        group.data.options?.push(subcommand.data);
    });

    return {
        data: group.data,
        async execute(interaction) {
            const subcommand = subcommands.get(
                interaction.options.getSubcommand(),
            );
            await group.execute?.(interaction);
            await subcommand?.execute(interaction);
        },
        async autocomplete(interaction) {
            const subcommand = subcommands.get(
                interaction.options.getSubcommand(),
            );
            await group.autocomplete?.(interaction);
            await subcommand?.autocomplete?.(interaction);
        },
    } satisfies SubcommandGroup;
};

const createSubcommandsCommand = (
    command: Partial<ChatInputCommand> & Pick<ChatInputCommand, 'data'>,
    subcommandsArray: (Subcommand | SubcommandGroup)[],
) => {
    const subcommands = new Collection<string, Subcommand | SubcommandGroup>();
    command.data.options = [];

    subcommandsArray.map((subcommand) => {
        subcommands.set(subcommand.data.name, subcommand);
        command.data.options?.push(subcommand.data);
    });

    return {
        data: command.data,
        async execute(interaction) {
            const subcommand = subcommands.get(
                interaction.options.getSubcommandGroup() ??
                    interaction.options.getSubcommand(),
            );
            await command.execute?.(interaction);
            await subcommand?.execute(interaction);
        },
        async autocomplete(interaction) {
            const subcommand = subcommands.get(
                interaction.options.getSubcommandGroup() ??
                    interaction.options.getSubcommand(),
            );
            await command.autocomplete?.(interaction);
            await subcommand?.autocomplete?.(interaction);
        },
    } satisfies ChatInputCommand;
};

export {
    Subcommand,
    SubcommandGroup,
    createSubcommandGroup,
    createSubcommandsCommand,
};
