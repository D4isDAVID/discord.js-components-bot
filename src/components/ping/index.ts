import { BotComponent } from '../../interfaces/bot-component-data.js';

export default {
    commands: [
        {
            data: {
                name: 'ping',
                description: 'Ping command',
            },
            async execute(interaction) {
                const { client } = interaction;
                await interaction.reply({
                    content: `🏓 Pong! \`${client.ws.ping}ms\``,
                    fetchReply: true,
                });
            },
        },
    ],
} as BotComponent;
