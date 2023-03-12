import { Collection } from 'discord.js';
import {
    BotCommand,
    BotMessageComponent,
    BotModal,
} from '../src/interfaces/bot-component-data.js';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, BotCommand>;
        messageComponents: Collection<string, BotMessageComponent>;
        modals: Collection<string, BotModal>;
    }
}
