import { IComponent } from '../data.js';
import chatInputCommand from './commands/chat-input-command.js';
import messageCommand from './commands/message-command.js';
import subcommands from './commands/subcommands.js';
import userCommand from './commands/user-command.js';
import button from './message-components/button.js';
import channelSelect from './message-components/channel-select.js';
import mentionableSelect from './message-components/mentionable-select.js';
import roleSelect from './message-components/role-select.js';
import stringSelect from './message-components/string-select.js';
import userSelect from './message-components/user-select.js';
import modal from './modal.js';

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
