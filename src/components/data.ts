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
    [ComponentType.ActionRow]: never;
    [ComponentType.Button]: APIButtonComponentWithCustomId;
    [ComponentType.StringSelect]: APIStringSelectComponent;
    [ComponentType.TextInput]: never;
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

type RestEventsMap = {
    [T in keyof RestEvents]: RestEvent<T>;
};
type WebSocketEventsMap = {
    [T in keyof ManagerShardEventsMap]: WebSocketEvent<T>;
};
type GatewayEventsMap = {
    [T in keyof MappedEvents]: GatewayEvent<T>;
};
type EventsMap = RestEventsMap & WebSocketEventsMap & GatewayEventsMap;

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
    readonly restEvents?: RestEventsMap[keyof RestEvents][];
    readonly wsEvents?: WebSocketEventsMap[keyof ManagerShardEventsMap][];
    readonly gatewayEvents?: GatewayEventsMap[keyof MappedEvents][];
    readonly commands?: ApplicationCommand[];
    readonly messageComponents?: MessageComponent[];
    readonly modals?: Modal[];
}

export {
    ApplicationCommand,
    Button,
    ChannelSelect,
    ChatInputCommand,
    ContextMenuCommand,
    ContextMenuInteractionType,
    EventExecuteArgs,
    EventName,
    EventsMap,
    GatewayEvent,
    GatewayEventsMap,
    IComponent,
    IEvent,
    IInteraction,
    InteractionData,
    InteractionExecuteArgs,
    MentionableSelect,
    MessageCommand,
    MessageComponent,
    MessageComponentDataMap,
    Modal,
    RestEvent,
    RestEventsMap,
    RoleSelect,
    SelectMenu,
    SelectMenuInteractionWithType,
    StringSelect,
    UserCommand,
    UserSelect,
    WebSocketEvent,
    WebSocketEventsMap,
};
