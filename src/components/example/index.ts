import { BotComponent } from '../../interfaces/bot-component-data.js';
import button from './button.js';
import command from './command.js';
import modal from './modal.js';
import selectMenu from './select-menu.js';

export default {
    commands: [command],
    messageComponents: [button, selectMenu],
    modals: [modal],
} as BotComponent;
