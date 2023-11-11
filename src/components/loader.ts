import { Collection, RESTPutAPIApplicationCommandsJSONBody } from 'discord.js';
import EventEmitter from 'node:events';
import { readdir } from 'node:fs/promises';
import { stdout } from 'node:process';
import { clearLine, moveCursor } from 'node:readline';
import { URL } from 'node:url';
import { inspect } from 'node:util';
import { client, exitOnEventError } from '../env.js';
import {
    ApplicationCommand,
    Component,
    EventName,
    EventsMap,
    MessageComponent,
    Modal,
} from './data.js';

const COMPONENTS_URL = new URL('./', import.meta.url);

const interactions = {
    commands: new Collection<string, ApplicationCommand>(),
    messageComponents: new Collection<string, MessageComponent>(),
    modals: new Collection<string, Modal>(),
};

const commands: RESTPutAPIApplicationCommandsJSONBody = [];

const registerEvents = (
    emitter: EventEmitter,
    events: EventsMap[EventName][],
) => {
    for (const event of events)
        emitter[event.type](event.name, (...args) =>
            //@ts-ignore
            event.execute(...args).catch((err) => {
                if (exitOnEventError) throw err;
                console.error(inspect(err));
            }),
        );
};

const loadComponent = ({
    restEvents,
    clientEvents,
    commands: componentCommands,
    messageComponents,
    modals,
}: Component) => {
    restEvents && registerEvents(client.rest, restEvents);
    clientEvents && registerEvents(client, clientEvents);

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

const loadComponents = async () => {
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

export { commands, interactions };
export default loadComponents;
