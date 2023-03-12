import { Events, InteractionType } from 'discord.js';
import { BotEvent } from '../../../interfaces/bot-component-data.js';

export default {
    type: 'on',
    name: Events.InteractionCreate,
    async execute(interaction) {
        const { client, type } = interaction;

        switch (type) {
            case InteractionType.ApplicationCommand:
                const command = client.commands.get(interaction.commandName);
                await command?.execute(interaction);
                break;
            case InteractionType.ApplicationCommandAutocomplete:
                const autocompleteCommand = client.commands.get(
                    interaction.commandName
                );
                await autocompleteCommand?.autocomplete!(interaction);
                break;
            case InteractionType.MessageComponent:
                const component = client.messageComponents.get(
                    interaction.customId
                );
                await component?.execute(interaction);
                break;
            case InteractionType.ModalSubmit:
                const modal = client.modals.get(interaction.customId);
                await modal?.execute(interaction);
                break;
            default:
                break;
        }
    },
} as BotEvent<Events.InteractionCreate>;
