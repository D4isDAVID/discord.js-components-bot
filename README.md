# Discord.js Components Bot

This is a [discord.js] bot template with a components system.
It is written in [TypeScript], and uses [`@discordjs/core`][@discordjs/core].

Out of the box, the template only adds a ping and some example commands.
Database support is also not included by default, and can be manually added.

- [Key Features](#key-features)
- [Configuration](#configuration)
- [Scripts](#scripts)

## Key Features

### Components System

Typically when developing Discord bots, we place handlers, events, commands,
interactions, etc. into their own respective folders.

The components system creates a more organized way to store all related
events, commands and other interactions in their own folder
([see components](./src/components/)).

### Interaction Utilities

The template comes with interaction utilities, allowing you to handle user
input with ease ([see example](./src/components/example/modal.ts)).

### Subcommand Utilities

The template comes with subcommand utilities, allowing you to create commands
with subcommands and subcommand groups with ease
([see example](./src/components/example/commands/subcommands.ts)).

### Stateful Interactions

The template comes with stateful modals & message components, allowing you to
handle simple state between interactions with ease
([see example](./src/components/example/stateful/stateful-modal.ts)).

## Configuration

- Make a copy of the [`.env.example`](./.env.example) file
- Name the new copy `.env`
- Configure the file

## Scripts

- `npm run lint` - Lint your code with [Prettier]
- `npm run format` - Format your code with [Prettier]
- `npm run build` - Build your code with the [TypeScript] compiler
- `npm run deploy` - Deploy commands to Discord
- `npm run start` - Start your bot

[discord.js]: https://discord.js.org
[@discordjs/core]: https://discord.js.org/docs/packages/core/2.0.0
[prettier]: https://prettier.io
[typescript]: https://typescriptlang.org
