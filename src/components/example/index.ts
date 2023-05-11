import { BotComponent } from '../../component-data.js';
import button from './button.js';
import command from './command.js';
import modal from './modal.js';
import selectMenu from './select-menu.js';
import subcommandsCommand from './subcommands-command.js';

export default {
    commands: [command, subcommandsCommand],
    messageComponents: [button, selectMenu],
    modals: [modal],
} as BotComponent;
