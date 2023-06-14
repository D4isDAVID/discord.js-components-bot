import { IComponent } from '../data.js';
import button from './button.js';
import channelSelect from './channel-select.js';
import chatInputCommand from './chat-input-command.js';
import mentionableSelect from './mentionable-select.js';
import messageCommand from './message-command.js';
import modal from './modal.js';
import roleSelect from './role-select.js';
import stringSelect from './string-select.js';
import subcommands from './subcommands.js';
import userCommand from './user-command.js';
import userSelect from './user-select.js';

export default {
    commands: [chatInputCommand, subcommands, userCommand, messageCommand],
    messageComponents: [
        button,
        stringSelect,
        userSelect,
        roleSelect,
        mentionableSelect,
        channelSelect,
    ],
    modals: [modal],
} satisfies IComponent;
