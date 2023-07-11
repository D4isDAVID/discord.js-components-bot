import { WebSocketShardEvents } from '@discordjs/ws';
import { gateway } from '../../env.js';
import { ChatInputCommand, Component, WebSocketEvent } from '../data.js';

let ping = -1;
const pingMessage = (p: string) => `🏓 Pong! \`${p}\``;

const heartbeatEvent = {
    name: WebSocketShardEvents.HeartbeatComplete,
    type: 'on',
    async execute({ latency }) {
        ping = latency;
    },
} satisfies WebSocketEvent<WebSocketShardEvents.HeartbeatComplete>;

const pingCommand = {
    data: {
        name: 'ping',
        description: 'Ping command',
    },
    async execute({ api, data: interaction }) {
        let replied = false;

        if (ping < 0) {
            const heartbeatPromise = new Promise<unknown>((resolve) => {
                gateway.once(WebSocketShardEvents.HeartbeatComplete, resolve);
            });

            await api.interactions.reply(interaction.id, interaction.token, {
                content: pingMessage('fetching...'),
            });

            await heartbeatPromise;
            replied = true;
        }

        await api.interactions[replied ? 'editReply' : 'reply'](
            replied ? interaction.application_id : interaction.id,
            interaction.token,
            {
                content: pingMessage(`${ping}ms`),
            },
        );
    },
} satisfies ChatInputCommand;

export default {
    wsEvents: [heartbeatEvent],
    commands: [pingCommand],
} satisfies Component;
