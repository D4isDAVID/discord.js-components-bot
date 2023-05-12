# Discord.js Components Bot

This is a [discord.js](https://discord.js.org) bot template with a components system.
It is written in TypeScript, and uses `@discordjs/core`.

Out of the box, the template only adds a ping and some example commands.
Database support is also not included by default, and can be manually added.

- [Key Features](#key-features)
- [Configuration](#configuration)
- [Scripts](#scripts)

## Key Features

### Components System

Typically when developing Discord bots, we place handlers, events,
commands, interactions, etc. into their own respective folders.

The components system creates a more organized way to store all
related events, commands and other interactions in their own folder
([see components](./src/components/)).

### Subcommand Utilities

The template adds subcommand utilities, allowing you to create
commands with subcommands and subcommand groups with ease
([see example](./src/components/example/subcommands.ts)).

## Configuration

- Make a copy of the [`.env.example`](./.env.example) file
- Name the copy `.env`
- Configure the file

## Scripts

- `lint` - Lint your code with [Prettier](https://prettier.io/)
- `format` - Format your code with Prettier
- `build` - Build your code with the TypeScript compiler
- `test` - Test your code (lint & build)
- `deploy` - Build your code & deploy commands to Discord
- `start` - Build your code & start your bot
- `node dist/deploy.js` - Deploy commands to Discord
- `node .` - Start your bot
