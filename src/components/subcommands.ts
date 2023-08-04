import { Collection } from '@discordjs/collection';
import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandSubcommandOption,
    APIChatInputApplicationCommandInteraction,
} from '@discordjs/core';
import { ChatInputCommand, InteractionExecuteArgs } from './data.js';

interface ISubcommandOrGroup<
    T extends
        | APIApplicationCommandSubcommandOption
        | APIApplicationCommandSubcommandGroupOption,
> {
    readonly data: T;
    readonly execute: (
        ...props: InteractionExecuteArgs<APIChatInputApplicationCommandInteraction>
    ) => Promise<void>;
    readonly autocomplete?: (
        ...props: InteractionExecuteArgs<APIApplicationCommandAutocompleteInteraction>
    ) => Promise<void>;
}

type Subcommand = ISubcommandOrGroup<APIApplicationCommandSubcommandOption>;
type SubcommandGroup =
    ISubcommandOrGroup<APIApplicationCommandSubcommandGroupOption>;

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
        async execute(props) {
            const { data: interaction } = props;
            const groupOption = interaction.data
                .options![0] as unknown as APIApplicationCommandSubcommandGroupOption;
            const subcommand = subcommands.get(groupOption.options![0]!.name);
            await group.execute?.(props);
            await subcommand?.execute(props);
        },
        async autocomplete(props) {
            const { data: interaction } = props;
            const groupOption = interaction.data
                .options![0] as unknown as APIApplicationCommandSubcommandGroupOption;
            const subcommand = subcommands.get(groupOption.options![0]!.name);
            await group.autocomplete?.(props);
            await subcommand?.autocomplete?.(props);
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
        async execute(props) {
            const { data: interaction } = props;
            const subcommand = subcommands.get(
                interaction.data.options![0]!.name,
            );
            await command.execute?.(props);
            await subcommand?.execute(props);
        },
        async autocomplete(props) {
            const { data: interaction } = props;
            const subcommand = subcommands.get(
                interaction.data.options![0]!.name,
            );
            await command.autocomplete?.(props);
            await subcommand?.autocomplete?.(props);
        },
    } satisfies ChatInputCommand;
};

export {
    Subcommand,
    SubcommandGroup,
    createSubcommandGroup,
    createSubcommandsCommand,
};
