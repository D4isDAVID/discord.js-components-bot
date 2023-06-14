import { Collection } from '@discordjs/collection';
import {
    GatewayDispatchEvents,
    RESTPutAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import EventEmitter from 'node:events';
import { readdir } from 'node:fs/promises';
import { stdout } from 'node:process';
import { clearLine, moveCursor } from 'node:readline';
import { URL } from 'node:url';
import { inspect } from 'node:util';
import { client, exitOnEventError, gateway, rest } from '../utils/env.js';
import {
    ApplicationCommand,
    EventName,
    EventsMap,
    GatewayEvent,
    IComponent,
    MessageComponent,
    Modal,
} from './data.js';
import interactionHandler from './interaction-handler.js';

const COMPONENTS_URL = new URL('./', import.meta.url);

export const interactions = {
    commands: new Collection<string, ApplicationCommand>(),
    messageComponents: new Collection<string, MessageComponent>(),
    modals: new Collection<string, Modal>(),
};

export const commands: RESTPutAPIApplicationCommandsJSONBody = [];

stdout.write('Loading components... ');

const registerEvent = (emitter: EventEmitter, event: EventsMap[EventName]) => {
    emitter[event.type](event.name, (...args) =>
        event.execute(...args).catch((err) => {
            if (exitOnEventError) throw err;
            console.error(inspect(err));
        })
    );
};

const registerEvents = (
    emitter: EventEmitter,
    events: EventsMap[EventName][]
) => {
    for (const event of events) registerEvent(emitter, event);
};

for await (const folder of (
    await readdir(COMPONENTS_URL, { withFileTypes: true })
).filter((f) => f.isDirectory())) {
    stdout.write(folder.name);

    const {
        restEvents,
        wsEvents,
        gatewayEvents,
        commands: componentCommands,
        messageComponents,
        modals,
    } = (
        await import(
            new URL(`./${folder.name}/index.js`, COMPONENTS_URL).pathname
        )
    ).default as IComponent;

    restEvents && registerEvents(rest, restEvents);
    wsEvents && registerEvents(gateway, wsEvents);
    gatewayEvents && registerEvents(client, gatewayEvents);

    componentCommands?.map((command) => {
        interactions.commands.set(command.data.name, command);
        commands.push(command.data);
    });
    messageComponents?.map((messageComponent) => {
        interactions.messageComponents.set(
            messageComponent.data.custom_id,
            messageComponent
        );
    });
    modals?.map((modal) => {
        interactions.modals.set(modal.data.custom_id, modal);
    });

    moveCursor(stdout, -folder.name.length, 0);
    clearLine(stdout, 1);
}

registerEvent(client, interactionHandler);
registerEvent(client, {
    name: GatewayDispatchEvents.Ready,
    type: 'once',
    async execute({ data }) {
        const { username, discriminator } = data.user;
        console.log(`Ready as ${username}#${discriminator}!`);
    },
} satisfies GatewayEvent<GatewayDispatchEvents.Ready>);

console.log('Done!');
