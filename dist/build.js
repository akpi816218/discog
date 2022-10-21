import * as discord from 'discord.js';
import { REST } from '@discordjs/rest';
import config from './config.json' assert { type: 'json' };
import fs from 'node:fs';
import path from 'node:path';
import { question } from 'readline-sync';
const { Routes } = discord;
const { clientId, guildId } = config;
const rl = { question }.question;
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '10' }).setToken(
	rl('Token: ', { hideEchoBack: true })
);
rest
	.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
