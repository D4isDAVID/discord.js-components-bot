import type {
    ApplicationCommandData,
    AutocompleteInteraction,
    ButtonInteraction,
    ChannelSelectMenuComponentData,
    ChannelSelectMenuInteraction,
    ClientEvents,
    CommandInteraction,
    InteractionButtonComponentData,
    MentionableSelectMenuComponentData,
    MentionableSelectMenuInteraction,
    ModalComponentData,
    ModalSubmitInteraction,
    RoleSelectMenuComponentData,
    RoleSelectMenuInteraction,
    StringSelectMenuComponentData,
    StringSelectMenuInteraction,
    UserSelectMenuComponentData,
    UserSelectMenuInteraction,
} from 'discord.js';

interface BotEvent<K extends keyof ClientEvents> {
    readonly type: 'on' | 'once';
    readonly name: K;
    readonly execute: (...args: ClientEvents[K]) => Promise<void>;
}

interface BotCommand {
    readonly data: ApplicationCommandData;
    readonly execute: (interaction: CommandInteraction) => Promise<void>;
    readonly autocomplete?: (
        interaction: AutocompleteInteraction
    ) => Promise<void>;
}

interface BotMessageComponent {
    readonly data:
        | InteractionButtonComponentData
        | StringSelectMenuComponentData
        | UserSelectMenuComponentData
        | RoleSelectMenuComponentData
        | MentionableSelectMenuComponentData
        | ChannelSelectMenuComponentData;
    readonly execute: (
        interaction:
            | ButtonInteraction
            | StringSelectMenuInteraction
            | UserSelectMenuInteraction
            | RoleSelectMenuInteraction
            | MentionableSelectMenuInteraction
            | ChannelSelectMenuInteraction
    ) => Promise<void>;
}

interface BotModal {
    readonly data: ModalComponentData;
    readonly execute: (interaction: ModalSubmitInteraction) => Promise<void>;
}

interface BotComponent {
    readonly events?: BotEvent<keyof ClientEvents>[];
    readonly commands?: BotCommand[];
    readonly messageComponents?: BotMessageComponent[];
    readonly modals?: BotModal[];
}

export { BotEvent, BotCommand, BotMessageComponent, BotModal, BotComponent };
