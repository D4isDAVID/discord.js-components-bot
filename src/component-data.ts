import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandInteraction,
    APIBaseInteraction,
    APIButtonComponentWithCustomId,
    APIMessageButtonInteractionData,
    APIMessageChannelSelectInteractionData,
    APIMessageMentionableSelectInteractionData,
    APIMessageRoleSelectInteractionData,
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
    RESTPostAPIApplicationCommandsJSONBody,
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

interface BotCommand {
    readonly data: RESTPostAPIApplicationCommandsJSONBody;
    readonly execute: (
        props: props<GatewayDispatchEvents.InteractionCreate> & {
            data: APIApplicationCommandInteraction;
        }
    ) => Promise<void>;
    readonly autocomplete?: (
        props: props<GatewayDispatchEvents.InteractionCreate> & {
            data: APIApplicationCommandAutocompleteInteraction;
        }
    ) => Promise<void>;
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

interface BotMessageComponentInteractionData {
    [ComponentType.Button]: APIMessageButtonInteractionData;
    [ComponentType.StringSelect]: APIMessageStringSelectInteractionData;
    [ComponentType.UserSelect]: APIMessageUserSelectInteractionData;
    [ComponentType.RoleSelect]: APIMessageRoleSelectInteractionData;
    [ComponentType.MentionableSelect]: APIMessageMentionableSelectInteractionData;
    [ComponentType.ChannelSelect]: APIMessageChannelSelectInteractionData;
}

interface BotMessageComponent<K extends BotMessageComponentType> {
    readonly data: BotMessageComponentData[K];
    readonly execute: (
        props: props<GatewayDispatchEvents.InteractionCreate> & {
            data: APIBaseInteraction<
                InteractionType.MessageComponent,
                BotMessageComponentInteractionData[K]
            >;
        }
    ) => Promise<void>;
}

interface BotModal {
    readonly data: APIModalInteractionResponseCallbackData;
    readonly execute: (
        props: props<GatewayDispatchEvents.InteractionCreate> & {
            data: APIModalSubmitInteraction;
        }
    ) => Promise<void>;
}

interface BotComponent {
    readonly restEvents?: BotRestEvent<keyof RestEvents>[];
    readonly wsEvents?: BotWebSocketEvent<keyof ManagerShardEventsMap>[];
    readonly events?: BotEvent<keyof MappedEvents>[];
    readonly commands?: BotCommand[];
    readonly messageComponents?: BotMessageComponent<BotMessageComponentType>[];
    readonly modals?: BotModal[];
}

export {
    BotRestEvent,
    BotWebSocketEvent,
    BotEvent,
    BotCommand,
    BotMessageComponentType,
    BotMessageComponent,
    BotModal,
    BotComponent,
};
