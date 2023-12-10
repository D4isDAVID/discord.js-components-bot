import {
    APIButtonComponentWithCustomId,
    APIChannelSelectComponent,
    APIMentionableSelectComponent,
    APIModalInteractionResponseCallbackData,
    APIRoleSelectComponent,
    APIStringSelectComponent,
    APIUserSelectComponent,
    AutocompleteInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    CommandInteraction,
    ComponentType,
    ContextMenuCommandInteraction,
    Events,
    Interaction,
    MentionableSelectMenuInteraction,
    MessageComponentInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    RESTEvents,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    RestEvents,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction,
} from 'discord.js';

type EventName = keyof RestEvents | keyof ClientEvents;

type EventExecuteArgs<T extends EventName> = T extends RESTEvents
    ? RestEvents[T]
    : T extends Events
      ? ClientEvents[T]
      : never;

interface IEvent<T extends EventName> {
    readonly type: 'on' | 'once';
    readonly name: T;
    readonly execute: (...args: EventExecuteArgs<T>) => Promise<void>;
}

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

type InteractionData<T extends Interaction> = T extends CommandInteraction
    ? T extends ChatInputCommandInteraction
        ? RESTPostAPIChatInputApplicationCommandsJSONBody
        : T extends ContextMenuCommandInteraction
          ? RESTPostAPIContextMenuApplicationCommandsJSONBody & {
                type: T['commandType'];
            }
          : never
    : T extends MessageComponentInteraction
      ? MessageComponentDataMap[T['componentType']]
      : T extends ModalSubmitInteraction
        ? APIModalInteractionResponseCallbackData
        : never;

interface IInteraction<T extends Interaction> {
    readonly data: InteractionData<T>;
    readonly execute: (props: T) => Promise<void>;
    readonly autocomplete?: T extends ChatInputCommandInteraction
        ? (interaction: AutocompleteInteraction) => Promise<void>
        : never;
}

type RestEvent<T extends keyof RestEvents> = IEvent<T>;
type ClientEvent<T extends keyof ClientEvents> = IEvent<T>;

type RestEventsMap = {
    [T in keyof RestEvents]: RestEvent<T>;
};
type ClientEventsMap = {
    [T in keyof ClientEvents]: ClientEvent<T>;
};
type EventsMap = RestEventsMap & ClientEventsMap;

type ChatInputCommand = IInteraction<ChatInputCommandInteraction>;
type UserCommand = IInteraction<UserContextMenuCommandInteraction>;
type MessageCommand = IInteraction<MessageContextMenuCommandInteraction>;
type ContextMenuCommand = UserCommand | MessageCommand;
type ApplicationCommand = ChatInputCommand | ContextMenuCommand;

type Button = IInteraction<ButtonInteraction>;
type StringSelect = IInteraction<StringSelectMenuInteraction>;
type UserSelect = IInteraction<UserSelectMenuInteraction>;
type RoleSelect = IInteraction<RoleSelectMenuInteraction>;
type MentionableSelect = IInteraction<MentionableSelectMenuInteraction>;
type ChannelSelect = IInteraction<ChannelSelectMenuInteraction>;
type SelectMenu =
    | StringSelect
    | UserSelect
    | RoleSelect
    | MentionableSelect
    | ChannelSelect;
type MessageComponent = Button | SelectMenu;

type Modal = IInteraction<ModalSubmitInteraction>;

interface Component {
    readonly restEvents?: RestEventsMap[keyof RestEvents][];
    readonly clientEvents?: ClientEventsMap[keyof ClientEvents][];
    readonly commands?: ApplicationCommand[];
    readonly messageComponents?: MessageComponent[];
    readonly modals?: Modal[];
}

export {
    ApplicationCommand,
    Button,
    ChannelSelect,
    ChatInputCommand,
    ClientEvent,
    ClientEventsMap,
    Component,
    ContextMenuCommand,
    EventExecuteArgs,
    EventName,
    EventsMap,
    IEvent,
    IInteraction,
    InteractionData,
    MentionableSelect,
    MessageCommand,
    MessageComponent,
    MessageComponentDataMap,
    Modal,
    RestEvent,
    RestEventsMap,
    RoleSelect,
    SelectMenu,
    StringSelect,
    UserCommand,
    UserSelect,
};
