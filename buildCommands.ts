import { Routes, SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { clientId } from './config.js';
import TOKEN from './TOKEN.js';
import { argv as args } from 'process';
args.shift();
args.shift();
import fs from 'node:fs';
import { dirname, default as path } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
let commandFiles;
console.log(args);
if (args.length == 0) {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
} else {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js') && args.includes(file));
}
console.log(commandFiles);
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	commands.push((command.data as SlashCommandBuilder).toJSON());
}
console.log(commands);
const rest = new REST({ version: '10' }).setToken(TOKEN as string);
await rest.put(Routes.applicationCommands(clientId), { body: commands });
console.log(await rest.get(Routes.applicationCommands(clientId)));
