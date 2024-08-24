import { Collection } from '@discordjs/collection';
import { RESTPutAPIApplicationCommandsJSONBody } from '@discordjs/core';
import EventEmitter from 'node:events';
import { readdir } from 'node:fs/promises';
import { stdout } from 'node:process';
import { clearLine, moveCursor } from 'node:readline';
import { URL } from 'node:url';
import { inspect } from 'node:util';
import {
    ApplicationCommand,
    Component,
    EventName,
    EventsMap,
    MessageComponent,
    Modal,
} from './types.js';
import { client, gateway, rest } from '/utils/env.js';
import { isStatefulInteraction } from '/utils/stateful.js';

const COMPONENTS_URL = new URL('./', import.meta.url);

export const interactions = {
    commands: new Collection<string, ApplicationCommand>(),
    messageComponents: new Collection<string, MessageComponent>(),
    modals: new Collection<string, Modal>(),
};

export const commands: RESTPutAPIApplicationCommandsJSONBody = [];

export const statefuls = {
    messageComponents: [],
    modals: [],
} as { messageComponents: string[]; modals: string[] };

function registerEvent(emitter: EventEmitter, event: EventsMap[EventName]) {
    emitter[event.type](event.name, async (...args) => {
        try {
            await event.execute(...args);
        } catch (err) {
            console.error(inspect(err));
        }
    });
}

function registerEvents(emitter: EventEmitter, events: EventsMap[EventName][]) {
    for (const event of events) {
        registerEvent(emitter, event);
    }
}

function loadComponent({
    restEvents,
    wsEvents,
    gatewayEvents,
    commands: componentCommands,
    messageComponents,
    modals,
}: Component) {
    restEvents && registerEvents(rest, restEvents);
    wsEvents && registerEvents(gateway, wsEvents);
    gatewayEvents && registerEvents(client, gatewayEvents);

    componentCommands?.map((command) => {
        interactions.commands.set(command.data.name, command);
        commands.push(command.data);
    });
    messageComponents?.map((messageComponent) => {
        const customId = messageComponent.data.custom_id;
        interactions.messageComponents.set(customId, messageComponent);

        if (isStatefulInteraction(messageComponent))
            statefuls.messageComponents.push(customId);
    });
    modals?.map((modal) => {
        const customId = modal.data.custom_id;
        interactions.modals.set(customId, modal);

        if (isStatefulInteraction(modal)) statefuls.modals.push(customId);
    });
}

export async function loadComponents() {
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
}
