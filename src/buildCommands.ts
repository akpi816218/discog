import { dirname, default as path } from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { TOKEN } from './TOKEN.js';
import { argv } from 'process';
import { clientId } from './config.js';
import { fileURLToPath } from 'url';
argv.shift();
argv.shift();
import fs from 'fs';
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
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
const rest = new REST({ version: '10' }).setToken(TOKEN);
await rest.put(Routes.applicationCommands(clientId), { body: [] });
await rest.put(Routes.applicationCommands(clientId), { body: commands });
// eslint-disable-next-line no-console
console.log(await rest.get(Routes.applicationCommands(clientId)));
