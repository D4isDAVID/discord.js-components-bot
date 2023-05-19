import { WebSocketShardEvents } from '@discordjs/ws';
import { gateway } from '../../utils/env.js';
import { ChatInputCommand, IComponent, WebSocketEvent } from '../data.js';

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
        let method: 'reply' | 'editReply' = 'reply';

        if (ping < 0) {
            const p = new Promise<void>((resolve) => {
                gateway.once(WebSocketShardEvents.HeartbeatComplete, () => {
                    resolve();
                });
            });
            method = 'editReply';
            await api.interactions.reply(interaction.id, interaction.token, {
                content: pingMessage('fetching...'),
            });
            await p;
        }

        await api.interactions[method](
            method === 'reply' ? interaction.id : interaction.application_id,
            interaction.token,
            {
                content: pingMessage(`${ping}ms`),
            }
        );
    },
} satisfies ChatInputCommand;

export default {
    wsEvents: [heartbeatEvent],
    commands: [pingCommand],
} satisfies IComponent;
