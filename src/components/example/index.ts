import { Component } from '../data.js';
import { exampleChatInputCommand } from './commands/chat-input-command.js';
import { exampleMessageCommand } from './commands/message-command.js';
import { exampleSubcommandsCommand } from './commands/subcommands.js';
import { exampleUserCommand } from './commands/user-command.js';
import { exampleButton } from './message-components/button.js';
import { exampleChannelSelect } from './message-components/channel-select.js';
import { exampleMentionableSelect } from './message-components/mentionable-select.js';
import { exampleRoleSelect } from './message-components/role-select.js';
import { exampleStringSelect } from './message-components/string-select.js';
import { exampleUserSelect } from './message-components/user-select.js';
import { exampleModal } from './modal.js';
import { exampleCommandWithStatefulModal } from './stateful/command-with-modal.js';
import { exampleStatefulModal } from './stateful/stateful-modal.js';

export default {
    commands: [
        exampleChatInputCommand,
        exampleSubcommandsCommand,
        exampleUserCommand,
        exampleMessageCommand,
        exampleCommandWithStatefulModal,
    ],
    messageComponents: [
        exampleButton,
        exampleStringSelect,
        exampleUserSelect,
        exampleRoleSelect,
        exampleMentionableSelect,
        exampleChannelSelect,
    ],
    modals: [exampleModal, exampleStatefulModal],
} satisfies Component;
