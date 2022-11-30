import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { clientId } from './config.js';
import { TOKEN } from './TOKEN.js';
import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '10' }).setToken(TOKEN);
rest
	.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
console.log(await rest.get(Routes.applicationCommands(clientId)));
