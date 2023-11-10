import {
    REST,
    RESTGetAPIOAuth2CurrentApplicationResult,
    Routes,
} from 'discord.js';
import { stdout } from 'node:process';
import loadComponents, { commands } from './components/loader.js';
import { botToken } from './env.js';

await loadComponents();
const rest = new REST({ version: '10' }).setToken(botToken);

stdout.write('Fetching application info... ');
const { id } = (await rest.get(
    Routes.oauth2CurrentApplication(),
)) as RESTGetAPIOAuth2CurrentApplicationResult;
console.log('Done!');

stdout.write('Deploying commands... ');
await rest.put(Routes.applicationCommands(id), { body: commands });
console.log('Done!');
