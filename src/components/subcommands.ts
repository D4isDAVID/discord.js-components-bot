import { Collection } from '@discordjs/collection';
import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandSubcommandOption,
    APIChatInputApplicationCommandInteraction,
    APIInteraction,
    ApplicationCommandOptionType,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';
import { ChatInputCommand, InteractionExecuteArgs } from './data.js';

type SubcommandOrGroupExecuteArgs<
    I extends APIInteraction,
    T extends
        | APIApplicationCommandSubcommandOption
        | APIApplicationCommandSubcommandGroupOption,
    G extends boolean = false,
> = InteractionExecuteArgs<I> & {
    subcommandData: T extends APIApplicationCommandSubcommandOption
        ? APIApplicationCommandSubcommandOption
        : never;
    subcommandGroupData: T extends APIApplicationCommandSubcommandGroupOption
        ? APIApplicationCommandSubcommandGroupOption
        : G extends true
          ? APIApplicationCommandSubcommandGroupOption
          : never;
};

interface ISubcommandOrGroup<
    T extends
        | APIApplicationCommandSubcommandOption
        | APIApplicationCommandSubcommandGroupOption,
    G extends T extends APIApplicationCommandSubcommandOption
        ? boolean
        : false = false,
> {
    readonly data: T;
    readonly execute: (
        props: SubcommandOrGroupExecuteArgs<
            APIChatInputApplicationCommandInteraction,
            T,
            G
        >,
    ) => Awaitable<void>;
    readonly autocomplete?: (
        props: SubcommandOrGroupExecuteArgs<
            APIApplicationCommandAutocompleteInteraction,
            T,
            G
        >,
    ) => Awaitable<void>;
}

export type Subcommand<G extends boolean = false> = ISubcommandOrGroup<
    APIApplicationCommandSubcommandOption,
    G
>;
export type SubcommandGroup =
    ISubcommandOrGroup<APIApplicationCommandSubcommandGroupOption>;

// Bunch of duplicate code below because these types are too complicated for me

export function createSubcommandGroup(
    group: Partial<SubcommandGroup> & Pick<SubcommandGroup, 'data'>,
    subcommandsArray: Subcommand<true>[],
) {
    const subcommands = new Collection<string, Subcommand<true>>();
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
            const subcommandData = groupOption.options![0]!;
            const subcommand = subcommands.get(subcommandData.name);
            await group.execute?.(props);
            //@ts-ignore
            props.subcommandData = subcommandData;
            await subcommand?.execute(props);
        },
        async autocomplete(props) {
            const { data: interaction } = props;
            const groupOption = interaction.data
                .options![0] as unknown as APIApplicationCommandSubcommandGroupOption;
            const subcommandData = groupOption.options![0]!;
            const subcommand = subcommands.get(subcommandData.name);
            await group.autocomplete?.(props);
            //@ts-ignore
            props.subcommandData = subcommandData;
            await subcommand?.autocomplete?.(props);
        },
    } satisfies SubcommandGroup;
}

export function createSubcommandsCommand(
    command: Partial<ChatInputCommand> & Pick<ChatInputCommand, 'data'>,
    subcommandsArray: (Subcommand | SubcommandGroup)[],
) {
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
            const subcommandData = interaction.data.options![0]!;
            const subcommand = subcommands.get(subcommandData.name);
            await command.execute?.(props);
            //@ts-ignore
            props[
                subcommandData.type === ApplicationCommandOptionType.Subcommand
                    ? 'subcommandData'
                    : 'subcommandGroupData'
            ] = subcommandData;
            //@ts-ignore
            await subcommand?.execute(props);
        },
        async autocomplete(props) {
            const { data: interaction } = props;
            const subcommandData = interaction.data.options![0]!;
            const subcommand = subcommands.get(subcommandData.name);
            await command.autocomplete?.(props);
            //@ts-ignore
            props[
                subcommandData.type === ApplicationCommandOptionType.Subcommand
                    ? 'subcommandData'
                    : 'subcommandGroupData'
            ] = subcommandData;
            //@ts-ignore
            await subcommand?.autocomplete?.(props);
        },
    } satisfies ChatInputCommand;
}
