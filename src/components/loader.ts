import { Collection } from '@discordjs/collection';
import { RESTPutAPIApplicationCommandsJSONBody } from '@discordjs/core';
import EventEmitter from 'node:events';
import { readdir } from 'node:fs/promises';
import { stdout } from 'node:process';
import { clearLine, moveCursor } from 'node:readline';
import { URL } from 'node:url';
import { inspect } from 'node:util';
import { client, exitOnEventError, gateway, rest } from '../env.js';
import {
    ApplicationCommand,
    Component,
    EventName,
    EventsMap,
    MessageComponent,
    Modal,
} from './data.js';

const COMPONENTS_URL = new URL('./', import.meta.url);

export const interactions = {
    commands: new Collection<string, ApplicationCommand>(),
    messageComponents: new Collection<string, MessageComponent>(),
    modals: new Collection<string, Modal>(),
};

export const commands: RESTPutAPIApplicationCommandsJSONBody = [];

const registerEvent = (emitter: EventEmitter, event: EventsMap[EventName]) => {
    emitter[event.type](event.name, async (...args) => {
        try {
            await event.execute(...args);
        } catch (err) {
            if (exitOnEventError) throw err;
            console.error(inspect(err));
        }
    });
};

const registerEvents = (
    emitter: EventEmitter,
    events: EventsMap[EventName][],
) => {
    for (const event of events) registerEvent(emitter, event);
};

const loadComponent = ({
    restEvents,
    wsEvents,
    gatewayEvents,
    commands: componentCommands,
    messageComponents,
    modals,
}: Component) => {
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
            messageComponent,
        );
    });
    modals?.map((modal) => {
        interactions.modals.set(modal.data.custom_id, modal);
    });
};

export const loadComponents = async () => {
    stdout.write('Loading components... ');

    for await (const folder of (
        await readdir(COMPONENTS_URL, { withFileTypes: true })
    ).filter((f) => f.isDirectory())) {
        stdout.write(folder.name);

        const component = (
            await import(
                new URL(`./${folder.name}/index.js`, COMPONENTS_URL).pathname
            )
        ).default as Component;
        loadComponent(component);

        moveCursor(stdout, -folder.name.length, 0);
        clearLine(stdout, 1);
    }

    console.log('Done!');
};
