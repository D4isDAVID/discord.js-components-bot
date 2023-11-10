import { ApplicationCommandType, Events, InteractionType } from 'discord.js';
import { ClientEvent } from '../data.js';
import { interactions } from '../loader.js';

export default {
    name: Events.InteractionCreate,
    type: 'on',
    async execute(interaction) {
        switch (interaction.type) {
            case InteractionType.ApplicationCommand:
            case InteractionType.ApplicationCommandAutocomplete:
                const command = interactions.commands.get(
                    interaction.commandName,
                );

                if (!command)
                    throw new Error(
                        `Command not defined for ${interaction.commandName}.`,
                    );

                if (
                    interaction.type === InteractionType.ApplicationCommand &&
                    (command.data.type ?? ApplicationCommandType.ChatInput) ===
                        interaction.commandType
                )
                    //@ts-ignore
                    await command.execute(interaction);
                else if (command.autocomplete)
                    //@ts-ignore
                    await command.autocomplete(interaction);
                break;

            case InteractionType.MessageComponent:
                const component = interactions.messageComponents.get(
                    interaction.customId,
                );

                if (!component)
                    throw new Error(
                        `Message component not defined for ${interaction.customId}.`,
                    );

                if (component.data.type === interaction.componentType)
                    //@ts-ignore
                    await component.execute(interaction);
                break;

            case InteractionType.ModalSubmit:
                const modal = interactions.modals.get(interaction.customId);

                if (!modal)
                    throw new Error(
                        `Modal not defined for ${interaction.customId}.`,
                    );

                //@ts-ignore
                await modal.execute(interaction);
                break;

            default:
                break;
        }
    },
} satisfies ClientEvent<Events.InteractionCreate>;
