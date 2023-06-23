import 'dotenv/config';
import { dirname, default as path } from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { argv } from 'process';
import { clientId } from './config';
import { fileURLToPath } from 'url';
import fs from 'fs';
argv.shift();
argv.shift();
const thisdirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
const commandsPath = path.join(thisdirname, 'commands');
let commandFiles;
if (argv.length == 0) {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts'));
} else {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts') && argv.includes(file));
}
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '10' }).setToken(
	process.env.DISCORD_TOKEN as string
);
await rest.put(Routes.applicationCommands(clientId), { body: [] });
await rest.put(Routes.applicationCommands(clientId), { body: commands });
// eslint-disable-next-line no-console
console.log(await rest.get(Routes.applicationCommands(clientId)));
