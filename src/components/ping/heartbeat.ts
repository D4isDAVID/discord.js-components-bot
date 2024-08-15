import { WebSocketShardEvents } from '@discordjs/ws';
import { WebSocketEvent } from '../data.js';

let ping = -1;
export function getPing() {
    return ping;
}

export default {
    name: WebSocketShardEvents.HeartbeatComplete,
    type: 'on',
    async execute({ latency }) {
        ping = latency;
    },
} satisfies WebSocketEvent<WebSocketShardEvents.HeartbeatComplete>;
