import { Collection } from '@discordjs/collection';
import { Client, ClientOptions } from '@discordjs/core';
import { readdir } from 'node:fs/promises';
import { clearLine, moveCursor } from 'node:readline';
import { BotComponent } from './component-data.js';

class BotClient extends Client {
    static readonly COMPONENTS_URL = new URL('../components', import.meta.url);

    constructor(options: ClientOptions) {
        super(options);

        this.commands = new Collection();
        this.messageComponents = new Collection();
        this.modals = new Collection();
    }

    async loadComponents(registerEvents: boolean = true) {
        process.stdout.write('Loading components... ');

        const components = (
            await readdir(BotClient.COMPONENTS_URL, {
                withFileTypes: true,
            })
        ).filter((f) => f.isDirectory() && f.name !== 'example');

        for await (const folder of components) {
            process.stdout.write(folder.name);
            const component = (
                await import(
                    `${BotClient.COMPONENTS_URL.pathname}/${folder.name}/index.js`
                )
            ).default as BotComponent;

            if (registerEvents) {
                component.restEvents?.map((event) => {
                    this.rest[event.type](event.name, event.execute);
                });

                component.wsEvents?.map((event) => {
                    this.ws[event.type](event.name, event.execute);
                });

                component.events?.map((event) => {
                    this[event.type](event.name, (props) =>
                        event.execute({ ...props, client: this })
                    );
                });
            }

            component.commands?.map((command) => {
                this.commands.set(command.data.name, command);
            });

            component.messageComponents?.map((messageComponent) => {
                this.messageComponents.set(
                    messageComponent.data.custom_id,
                    messageComponent
                );
            });

            component.modals?.map((modal) => {
                this.modals.set(modal.data.custom_id, modal);
            });

            moveCursor(process.stdout, -folder.name.length, 0);
            clearLine(process.stdout, 1);
        }

        console.log('Done!');
    }
}

export default BotClient;
