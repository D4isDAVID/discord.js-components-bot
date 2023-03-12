import { BotComponent } from '../../interfaces/bot-component-data.js';
import interactionCreate from './events/interaction-create.js';
import ready from './events/ready.js';

export default {
    events: [ready, interactionCreate],
} as BotComponent;
