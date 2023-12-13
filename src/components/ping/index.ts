import { ChatInputCommand, Component } from '../data.js';

const pingMessage = (p: string) => `🏓 Pong! \`${p}\``;

export default {
    commands: [
        {
            data: {
                name: 'ping',
                description: 'Ping command',
            },
            async execute(interaction) {
                const { client } = interaction;

                if (client.ws.ping < 0) {
                    const response = await interaction.reply({
                        content: pingMessage('fetching...'),
                        fetchReply: true,
                    });
                    await interaction.editReply({
                        content: pingMessage(
                            `~${
                                response.createdTimestamp -
                                interaction.createdTimestamp
                            }ms`,
                        ),
                    });
                    return;
                }

                await interaction.reply({
                    content: pingMessage(`${client.ws.ping}ms`),
                });
            },
        } satisfies ChatInputCommand,
    ],
} satisfies Component;
