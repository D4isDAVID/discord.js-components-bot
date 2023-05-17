import { IComponent } from '../../component-data.js';
import button from './button.js';
import command from './command.js';
import modal from './modal.js';
import selectMenu from './select-menu.js';
import subcommands from './subcommands.js';

export default {
    commands: [command, subcommands],
    messageComponents: [button, selectMenu],
    modals: [modal],
} satisfies IComponent;
