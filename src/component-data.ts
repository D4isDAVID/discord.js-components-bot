import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandInteraction,
    APIButtonComponentWithCustomId,
    APIChannelSelectComponent,
    APIChatInputApplicationCommandInteraction,
    APIContextMenuInteraction,
    APIInteraction,
    APIMentionableSelectComponent,
    APIMessageApplicationCommandInteraction,
    APIMessageComponentButtonInteraction,
    APIMessageComponentInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIModalInteractionResponseCallbackData,
    APIModalSubmitInteraction,
    APIRoleSelectComponent,
    APIStringSelectComponent,
    APIUserApplicationCommandInteraction,
    APIUserSelectComponent,
    ApplicationCommandType,
    ComponentType,
    MappedEvents,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    WithIntrinsicProps,
} from '@discordjs/core';
import { RestEvents } from '@discordjs/rest';
import { ManagerShardEventsMap } from '@discordjs/ws';

type EventName =
    | keyof RestEvents
    | keyof ManagerShardEventsMap
    | keyof MappedEvents;

type EventExecuteArgs<T extends EventName> = T extends keyof RestEvents
    ? RestEvents[T]
    : T extends keyof ManagerShardEventsMap
    ? ManagerShardEventsMap[T]
    : T extends keyof MappedEvents
    ? MappedEvents[T]
    : never;

interface IEvent<T extends EventName> {
    readonly type: 'on' | 'once';
    readonly name: T;
    readonly execute: (...args: EventExecuteArgs<T>) => Promise<void>;
}

type ContextMenuInteractionType<T extends APIContextMenuInteraction> =
    T extends APIUserApplicationCommandInteraction
        ? ApplicationCommandType.User
        : T extends APIMessageApplicationCommandInteraction
        ? ApplicationCommandType.Message
        : never;

interface MessageComponentDataMap {
    [ComponentType.Button]: APIButtonComponentWithCustomId;
    [ComponentType.StringSelect]: APIStringSelectComponent;
    [ComponentType.UserSelect]: APIUserSelectComponent;
    [ComponentType.RoleSelect]: APIRoleSelectComponent;
    [ComponentType.MentionableSelect]: APIMentionableSelectComponent;
    [ComponentType.ChannelSelect]: APIChannelSelectComponent;
}

type InteractionData<T extends APIInteraction> =
    T extends APIApplicationCommandInteraction
        ? T extends APIChatInputApplicationCommandInteraction
            ? RESTPostAPIChatInputApplicationCommandsJSONBody
            : T extends APIContextMenuInteraction
            ? RESTPostAPIContextMenuApplicationCommandsJSONBody & {
                  type: ContextMenuInteractionType<T>;
              }
            : never
        : T extends APIMessageComponentInteraction
        ? MessageComponentDataMap[T['data']['component_type']]
        : T extends APIModalSubmitInteraction
        ? APIModalInteractionResponseCallbackData
        : never;

type InteractionExecuteArgs<T extends APIInteraction> = [WithIntrinsicProps<T>];

interface IInteraction<T extends APIInteraction> {
    readonly data: InteractionData<T>;
    readonly execute: (...props: InteractionExecuteArgs<T>) => Promise<void>;
    readonly autocomplete?: T extends APIChatInputApplicationCommandInteraction
        ? (
              ...props: InteractionExecuteArgs<APIApplicationCommandAutocompleteInteraction>
          ) => Promise<void>
        : never;
}

type SelectMenuInteractionWithType<T extends ComponentType> =
    APIMessageComponentSelectMenuInteraction & { data: { component_type: T } };

type RestEvent<T extends keyof RestEvents> = IEvent<T>;
type WebSocketEvent<T extends keyof ManagerShardEventsMap> = IEvent<T>;
type GatewayEvent<T extends keyof MappedEvents> = IEvent<T>;

type ChatInputCommand = IInteraction<APIChatInputApplicationCommandInteraction>;
type UserCommand = IInteraction<APIUserApplicationCommandInteraction>;
type MessageCommand = IInteraction<APIMessageApplicationCommandInteraction>;
type ContextMenuCommand = UserCommand | MessageCommand;
type ApplicationCommand = ChatInputCommand | ContextMenuCommand;

type Button = IInteraction<APIMessageComponentButtonInteraction>;
type StringSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.StringSelect>
>;
type UserSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.UserSelect>
>;
type RoleSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.RoleSelect>
>;
type MentionableSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.MentionableSelect>
>;
type ChannelSelect = IInteraction<
    SelectMenuInteractionWithType<ComponentType.ChannelSelect>
>;
type SelectMenu =
    | StringSelect
    | UserSelect
    | RoleSelect
    | MentionableSelect
    | ChannelSelect;
type MessageComponent = Button | SelectMenu;

type Modal = IInteraction<APIModalSubmitInteraction>;

interface IComponent {
    readonly restEvents?: {
        [K in keyof RestEvents]: RestEvent<K>;
    }[keyof RestEvents][];
    readonly wsEvents?: {
        [K in keyof ManagerShardEventsMap]: WebSocketEvent<K>;
    }[keyof ManagerShardEventsMap][];
    readonly events?: {
        [K in keyof MappedEvents]: GatewayEvent<K>;
    }[keyof MappedEvents][];
    readonly commands?: ApplicationCommand[];
    readonly messageComponents?: MessageComponent[];
    readonly modals?: Modal[];
}

export {
    EventName,
    EventExecuteArgs,
    IEvent,
    ContextMenuInteractionType,
    MessageComponentDataMap,
    InteractionData,
    InteractionExecuteArgs,
    IInteraction,
    SelectMenuInteractionWithType,
    RestEvent,
    WebSocketEvent,
    GatewayEvent,
    ChatInputCommand,
    UserCommand,
    MessageCommand,
    ContextMenuCommand,
    ApplicationCommand,
    Button,
    StringSelect,
    UserSelect,
    RoleSelect,
    MentionableSelect,
    ChannelSelect,
    SelectMenu,
    MessageComponent,
    Modal,
    IComponent,
};
