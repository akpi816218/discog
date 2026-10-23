import 'dotenv/config';
import {
	commandsPath,
	registerCommands,
	registerGuildCommands
} from './registerCommands';
import { argv } from 'process';
import { readdir } from 'fs/promises';

argv.shift();
argv.shift();

const dirResult = await readdir(commandsPath, { withFileTypes: true });

let commandFiles: string[];
let guilds: string[];
if (argv.includes('-g')) {
	commandFiles = [];
	guilds = dirResult
		.filter((file) => file.isDirectory() && /^\d+$/.test(file.name))
		.map((file) => file.name);
} else if (argv.length == 0) {
	commandFiles = dirResult
		.filter((file) => file.name.endsWith('.ts'))
		.map((file) => file.name);
	guilds = dirResult
		.filter((file) => file.isDirectory() && /^\d+$/.test(file.name))
		.map((file) => file.name);
} else {
	commandFiles = dirResult
		.filter(
			(file) =>
				file.name.endsWith('.ts') && argv.includes(file.name.replace('.ts', ''))
		)
		.map((file) => file.name);
	guilds = dirResult
		.filter(
			(file) =>
				file.isDirectory() &&
				/^\d+$/.test(file.name) &&
				argv.includes(file.name)
		)
		.map((file) => file.name);
}

console.log(
	`Registering ${commandFiles.length} global commands and commands for ${guilds.length} guilds...`
);

await registerCommands(process.env.DISCORD_TOKEN as string, commandFiles);

for (const guildId of guilds) {
	await registerGuildCommands(process.env.DISCORD_TOKEN as string, guildId);
}

console.log('Commands registered successfully');
