import { Collection } from '@discordjs/collection';
import {
    BotCommand,
    BotMessageComponent,
    BotMessageComponentType,
    BotModal,
} from '../src/bot/component-data.js';

declare module '@discordjs/core' {
    export interface Client {
        commands: Collection<string, BotCommand>;
        messageComponents: Collection<
            string,
            BotMessageComponent<BotMessageComponentType>
        >;
        modals: Collection<string, BotModal>;
    }
}
