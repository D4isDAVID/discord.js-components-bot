import { IComponent } from '../../component-data.js';
import button from './button.js';
import chatInputCommand from './chat-input-command.js';
import messageCommand from './message-command.js';
import modal from './modal.js';
import selectMenu from './select-menu.js';
import subcommands from './subcommands.js';
import userCommand from './user-command.js';

export default {
    commands: [chatInputCommand, subcommands, userCommand, messageCommand],
    messageComponents: [button, selectMenu],
    modals: [modal],
} satisfies IComponent;
