import { Collection } from '@discordjs/collection';
import { APIApplicationCommandInteraction, Client } from '@discordjs/core';
import { WebSocketManager } from '@discordjs/ws';
import { readdir } from 'node:fs/promises';
import { stdout } from 'node:process';
import { clearLine, moveCursor } from 'node:readline';
import { URL } from 'node:url';
import {
    BotCommand,
    BotComponent,
    BotMessageComponent,
    BotMessageComponentType,
    BotModal,
} from './component-data.js';

const loadComponents = async (componentsUrl: URL, client?: Client) => {
    stdout.write('Loading components... ');

    const components = (
        await readdir(componentsUrl, { withFileTypes: true })
    ).filter((f) => f.isDirectory());

    const interactions = {
        commands: new Collection(),
        messageComponents: new Collection(),
        modals: new Collection(),
    } as {
        readonly commands: Collection<
            string,
            BotCommand<APIApplicationCommandInteraction>
        >;
        readonly messageComponents: Collection<
            string,
            BotMessageComponent<BotMessageComponentType>
        >;
        readonly modals: Collection<string, BotModal>;
    };

    for await (const folder of components) {
        stdout.write(folder.name);
        const {
            restEvents,
            wsEvents,
            events,
            commands,
            messageComponents,
            modals,
        } = (await import(`${componentsUrl.pathname}/${folder.name}/index.js`))
            .default as BotComponent;

        if (client) {
            restEvents?.map((event) => {
                client.rest[event.type](event.name, event.execute);
            });
            wsEvents?.map((event) => {
                (client.gateway as WebSocketManager)[event.type](
                    event.name,
                    event.execute
                );
            });
            events?.map((event) => {
                client[event.type](event.name, (props) =>
                    event.execute({ ...props, client })
                );
            });
        }

        commands?.map((command) => {
            interactions.commands.set(command.data.name, command);
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

    console.log('Done!');
    return interactions;
};

export default loadComponents;
