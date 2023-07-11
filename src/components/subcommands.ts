import { Collection } from '@discordjs/collection';
import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandSubcommandOption,
    APIChatInputApplicationCommandInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from '@discordjs/core';
import { ChatInputCommand, InteractionExecuteArgs } from './data.js';

interface ISubcommandOrGroup<
    T extends
        | APIApplicationCommandSubcommandOption
        | APIApplicationCommandSubcommandGroupOption
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
    data: APIApplicationCommandSubcommandGroupOption,
    subcommandsArray: Subcommand[]
) => {
    const subcommands = new Collection<string, Subcommand>();
    data.options = [];

    subcommandsArray.map((subcommand) => {
        subcommands.set(subcommand.data.name, subcommand);
        data.options?.push(subcommand.data);
    });

    return {
        data,
        execute(props) {
            const { data: interaction } = props;
            const group = interaction.data
                .options![0] as unknown as APIApplicationCommandSubcommandGroupOption;
            const subcommand = subcommands.get(group.options![0]!.name);
            return subcommand?.execute(props);
        },
        autocomplete(props) {
            const { data: interaction } = props;
            const group = interaction.data
                .options![0] as unknown as APIApplicationCommandSubcommandGroupOption;
            const subcommand = subcommands.get(group.options![0]!.name);
            if (!subcommand?.autocomplete) return;
            return subcommand?.autocomplete(props);
        },
    } as SubcommandGroup;
};

const createSubcommandsCommand = (
    data: RESTPostAPIChatInputApplicationCommandsJSONBody,
    subcommandsArray: (Subcommand | SubcommandGroup)[]
) => {
    const subcommands = new Collection<string, Subcommand | SubcommandGroup>();
    data.options = [];

    subcommandsArray.map((subcommand) => {
        subcommands.set(subcommand.data.name, subcommand);
        data.options?.push(subcommand.data);
    });

    return {
        data,
        execute(props) {
            const { data: interaction } = props;
            const subcommand = subcommands.get(
                interaction.data.options![0]!.name
            );
            return subcommand?.execute(props);
        },
        autocomplete(props) {
            const { data: interaction } = props;
            const subcommand = subcommands.get(
                interaction.data.options![0]!.name
            );
            if (!subcommand?.autocomplete) return;
            return subcommand?.autocomplete(props);
        },
    } as ChatInputCommand;
};

export {
    Subcommand,
    SubcommandGroup,
    createSubcommandGroup,
    createSubcommandsCommand,
};
