import { Collection } from '@discordjs/collection';
import { Client } from '@discordjs/core';
import { WebSocketManager } from '@discordjs/ws';
import { readdir } from 'node:fs/promises';
import { stdout } from 'node:process';
import { clearLine, moveCursor } from 'node:readline';
import { URL } from 'node:url';
import { inspect } from 'node:util';
import {
    ApplicationCommand,
    IComponent,
    MessageComponent,
    Modal,
} from './component-data.js';
import { exitOnComponentError, exitOnEventError } from './env.js';

const throwOrLogEventError = (err: unknown) => {
    if (exitOnEventError) throw err;
    else console.error(inspect(err));
};

const loadComponents = async (componentsUrl: URL, client?: Client) => {
    stdout.write('Loading components... ');

    const components = (
        await readdir(componentsUrl, { withFileTypes: true })
    ).filter((f) => f.isDirectory());

    const errors = new Collection<string, unknown>();

    const interactions = {
        commands: new Collection<string, ApplicationCommand>(),
        messageComponents: new Collection<string, MessageComponent>(),
        modals: new Collection<string, Modal>(),
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
        } = (
            await import(
                `${componentsUrl.pathname}/${folder.name}/index.js`
            ).catch((err) => {
                if (exitOnComponentError) {
                    console.log('\n');
                    throw err;
                } else {
                    errors.set(folder.name, err);
                    return { default: {} };
                }
            })
        ).default as IComponent;

        if (client) {
            restEvents?.map((event) => {
                client.rest[event.type](event.name, (...args) =>
                    //@ts-expect-error
                    event.execute(...args).catch(throwOrLogEventError)
                );
            });
            wsEvents?.map((event) => {
                (client.gateway as WebSocketManager)[event.type](
                    event.name,
                    (...args) =>
                        //@ts-expect-error
                        event.execute(...args).catch(throwOrLogEventError)
                );
            });
            events?.map((event) => {
                client[event.type](event.name, (...props) =>
                    //@ts-expect-error
                    event.execute(...props).catch(throwOrLogEventError)
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

    for (const [component, err] of errors.entries())
        console.error(
            `\nComponent ${component} failed to load: ${inspect(err)}\n`
        );

    return interactions;
};

export default loadComponents;
