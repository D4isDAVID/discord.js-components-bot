import { Client, ClientOptions, Collection } from 'discord.js';
import { readdir } from 'node:fs/promises';
import { clearLine, moveCursor } from 'node:readline';
import { BotComponent } from '../interfaces/bot-component-data.js';

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
        const components = await readdir(BotClient.COMPONENTS_URL, {
            withFileTypes: true,
        });
        for await (const folder of components) {
            if (!folder.isDirectory() || folder.name === 'example') continue;
            process.stdout.write(folder.name);
            const component = (
                await import(
                    `${BotClient.COMPONENTS_URL.pathname}/${folder.name}/index.js`
                )
            ).default as BotComponent;
            if (registerEvents)
                component.events?.map((event) => {
                    this[event.type](event.name, event.execute);
                });
            component.commands?.map((command) => {
                this.commands.set(command.data.name, command);
            });
            component.messageComponents?.map((messageComponent) => {
                this.messageComponents.set(
                    messageComponent.data.customId,
                    messageComponent
                );
            });
            component.modals?.map((modal) => {
                this.modals.set(modal.data.customId, modal);
            });
            moveCursor(process.stdout, -folder.name.length, 0);
            clearLine(process.stdout, 1);
        }
        console.log('Done!');
    }

    override async login(token?: string) {
        process.stdout.write('Logging in... ');
        return super.login(token).then((t) => {
            console.log('Done!');
            return t;
        });
    }
}

export default BotClient;
