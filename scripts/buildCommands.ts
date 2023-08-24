import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { dirname, default as path } from 'path';
import { argv } from 'process';
import { clientId } from '../src/config';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';
argv.shift();
argv.shift();
const thisdirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
const commandsPath = path.join(thisdirname, 'commands');
let commandFiles;
if (argv.length == 0) {
	commandFiles = (await readdir(commandsPath)).filter((file) =>
		file.endsWith('.ts')
	);
} else {
	commandFiles = (await readdir(commandsPath)).filter(
		(file) => file.endsWith('.ts') && argv.includes(file.replace('.ts', ''))
	);
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
if (!process.env.DISCORD_TOKEN) {
	// eslint-disable-next-line no-console
	console.log('No token found');
	process.exit(1);
}
// eslint-disable-next-line no-console
console.log('Registering commands...');
const data = await new REST()
	.setToken(process.env.DISCORD_TOKEN as string)
	.put(Routes.applicationCommands(clientId), {
		body: commands
	});
// eslint-disable-next-line no-console
console.log(data);
