import 'dotenv/config';
import {
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	Routes,
	SlashCommandBuilder
} from 'discord.js';
import { dirname, default as path } from 'path';
import { REST } from '@discordjs/rest';
import { argv } from 'process';
import { clientId } from './config';
import { fileURLToPath } from 'url';
import fs from 'fs';
argv.shift();
argv.shift();
const thisdirname = dirname(fileURLToPath(import.meta.url));
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandsPath = path.join(thisdirname, 'commands');
let commandFiles;
if (argv.length == 0) {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts'));
} else {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => argv.includes(file.replace('.ts', '')));
}
if (commandFiles.length == 0) {
	// eslint-disable-next-line no-console
	console.log('No commands found');
	process.exit(1);
}
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command: {
		data: SlashCommandBuilder;
		// eslint-disable-next-line no-unused-vars
		execute?: (interaction: unknown) => Promise<void>;
	} = await import(filePath);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '10' }).setToken(
	process.env.DISCORD_TOKEN as string
);
await rest.put(Routes.applicationCommands(clientId), { body: [] });
await rest.put(Routes.applicationCommands(clientId), { body: commands });
// eslint-disable-next-line no-console
console.log(await rest.get(Routes.applicationCommands(clientId)));
