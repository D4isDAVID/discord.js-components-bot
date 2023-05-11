import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandInteraction,
    APIBaseInteraction,
    APIButtonComponentWithCustomId,
    APIChatInputApplicationCommandInteraction,
    APIInteraction,
    APIMessageChannelSelectInteractionData,
    APIMessageComponentButtonInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIMessageMentionableSelectInteractionData,
    APIMessageRoleSelectInteractionData,
    APIMessageSelectMenuInteractionData,
    APIMessageStringSelectInteractionData,
    APIMessageUserSelectInteractionData,
    APIModalInteractionResponseCallbackData,
    APIModalSubmitInteraction,
    APISelectMenuComponent,
    Client,
    ComponentType,
    GatewayDispatchEvents,
    InteractionType,
    MappedEvents,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from '@discordjs/core';
import { RestEvents } from '@discordjs/rest';
import { ManagerShardEventsMap } from '@discordjs/ws';

interface BotRestEvent<K extends keyof RestEvents> {
    readonly type: 'on' | 'once';
    readonly name: K;
    readonly execute: (...args: RestEvents[K]) => Promise<void>;
}

interface BotWebSocketEvent<K extends keyof ManagerShardEventsMap> {
    readonly type: 'on' | 'once';
    readonly name: K;
    readonly execute: (...args: ManagerShardEventsMap[K]) => Promise<void>;
}

type props<K extends keyof MappedEvents> = MappedEvents[K][0] & {
    client: Client;
};

interface BotEvent<K extends keyof MappedEvents> {
    readonly type: 'on' | 'once';
    readonly name: K;
    readonly execute: (props: props<K>) => Promise<void>;
}

type BotInteractionExecute<T extends APIInteraction> = (
    props: props<GatewayDispatchEvents.InteractionCreate> & { data: T }
) => Promise<void>;

type BotCommandAutocomplete = (
    props: props<GatewayDispatchEvents.InteractionCreate> & {
        data: APIApplicationCommandAutocompleteInteraction;
    }
) => Promise<void>;

interface BotCommand<T extends APIApplicationCommandInteraction> {
    readonly data: T extends APIChatInputApplicationCommandInteraction
        ? RESTPostAPIChatInputApplicationCommandsJSONBody
        : RESTPostAPIContextMenuApplicationCommandsJSONBody;
    readonly execute: BotInteractionExecute<T>;
    readonly autocomplete?: T extends APIChatInputApplicationCommandInteraction
        ? BotCommandAutocomplete
        : never;
}

type BotMessageComponentType =
    | ComponentType.Button
    | ComponentType.StringSelect
    | ComponentType.UserSelect
    | ComponentType.RoleSelect
    | ComponentType.MentionableSelect
    | ComponentType.ChannelSelect;

interface BotMessageComponentData {
    [ComponentType.Button]: APIButtonComponentWithCustomId & {
        type: ComponentType.Button;
    };
    [ComponentType.StringSelect]: APISelectMenuComponent & {
        type: ComponentType.StringSelect;
    };
    [ComponentType.UserSelect]: APISelectMenuComponent & {
        type: ComponentType.UserSelect;
    };
    [ComponentType.RoleSelect]: APISelectMenuComponent & {
        type: ComponentType.RoleSelect;
    };
    [ComponentType.MentionableSelect]: APISelectMenuComponent & {
        type: ComponentType.MentionableSelect;
    };
    [ComponentType.ChannelSelect]: APISelectMenuComponent & {
        type: ComponentType.ChannelSelect;
    };
}

type BotSelectMenuInteraction<T extends APIMessageSelectMenuInteractionData> =
    APIMessageComponentSelectMenuInteraction &
        APIBaseInteraction<InteractionType.MessageComponent, T>;

interface BotMessageComponentInteraction {
    [ComponentType.Button]: APIMessageComponentButtonInteraction;
    [ComponentType.StringSelect]: BotSelectMenuInteraction<APIMessageStringSelectInteractionData>;
    [ComponentType.UserSelect]: BotSelectMenuInteraction<APIMessageUserSelectInteractionData>;
    [ComponentType.RoleSelect]: BotSelectMenuInteraction<APIMessageRoleSelectInteractionData>;
    [ComponentType.MentionableSelect]: BotSelectMenuInteraction<APIMessageMentionableSelectInteractionData>;
    [ComponentType.ChannelSelect]: BotSelectMenuInteraction<APIMessageChannelSelectInteractionData>;
    [ComponentType.ActionRow]: never;
    [ComponentType.TextInput]: never;
}

interface BotMessageComponent<T extends BotMessageComponentType> {
    readonly data: BotMessageComponentData[T];
    readonly execute: BotInteractionExecute<BotMessageComponentInteraction[T]>;
}

interface BotModal {
    readonly data: APIModalInteractionResponseCallbackData;
    readonly execute: BotInteractionExecute<APIModalSubmitInteraction>;
}

interface BotComponent {
    readonly restEvents?: BotRestEvent<keyof RestEvents>[];
    readonly wsEvents?: BotWebSocketEvent<keyof ManagerShardEventsMap>[];
    readonly events?: BotEvent<keyof MappedEvents>[];
    readonly commands?: BotCommand<APIApplicationCommandInteraction>[];
    readonly messageComponents?: BotMessageComponent<BotMessageComponentType>[];
    readonly modals?: BotModal[];
}

export {
    BotRestEvent,
    BotWebSocketEvent,
    props,
    BotEvent,
    BotInteractionExecute,
    BotCommandAutocomplete,
    BotCommand,
    BotMessageComponentType,
    BotMessageComponentData,
    BotSelectMenuInteraction,
    BotMessageComponentInteraction,
    BotMessageComponent,
    BotModal,
    BotComponent,
};
