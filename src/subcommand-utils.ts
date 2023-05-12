import { Collection } from '@discordjs/collection';
import {
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandSubcommandOption,
    APIChatInputApplicationCommandInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from '@discordjs/core';
import {
    BotCommand,
    BotCommandAutocomplete,
    BotInteractionExecute,
} from './component-data.js';

interface BotSubcommandOrGroup<
    T extends
        | APIApplicationCommandSubcommandOption
        | APIApplicationCommandSubcommandGroupOption
> {
    readonly data: T;
    readonly execute: BotInteractionExecute<APIChatInputApplicationCommandInteraction>;
    readonly autocomplete?: BotCommandAutocomplete;
}

type BotSubcommand =
    BotSubcommandOrGroup<APIApplicationCommandSubcommandOption>;
type BotSubcommandGroup =
    BotSubcommandOrGroup<APIApplicationCommandSubcommandGroupOption>;

const generateSubcommandGroup = (
    data: APIApplicationCommandSubcommandGroupOption,
    subcommandsArray: BotSubcommand[]
) => {
    const subcommands = new Collection<string, BotSubcommand>();
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
    } as BotSubcommandGroup;
};

const generateSubcommandsCommand = (
    data: RESTPostAPIChatInputApplicationCommandsJSONBody,
    subcommandsArray: (BotSubcommand | BotSubcommandGroup)[]
) => {
    const subcommands = new Collection<
        string,
        BotSubcommand | BotSubcommandGroup
    >();
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
    } as BotCommand<APIChatInputApplicationCommandInteraction>;
};

export {
    BotSubcommand,
    BotSubcommandGroup,
    generateSubcommandGroup,
    generateSubcommandsCommand,
};
