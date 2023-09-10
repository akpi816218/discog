import { BaseInteraction, Routes, SlashCommandBuilder } from 'discord.js';
import { dirname, join } from 'path';
import { REST } from '@discordjs/rest';
import { clientId } from '../src/config';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';

export const commandsPath = join(
	dirname(fileURLToPath(import.meta.url)),
	'..',
	'src',
	'commands'
);

export async function registerCommands(
	token: string,
	commandFiles?: string[]
): Promise<{
	data: unknown;
	getCommands: () => Promise<unknown>;
	rest: REST;
}> {
	return new Promise(async (resolve, reject) => {
		// eslint-disable-next-line no-param-reassign
		commandFiles =
			commandFiles ??
			(await readdir(commandsPath)).filter((file) => file.endsWith('.ts'));
		const commands = [];
		for (const file of commandFiles)
			commands.push(
				(
					(await import(join(commandsPath, file))) as {
						data: SlashCommandBuilder;
						// eslint-disable-next-line no-unused-vars
						execute?: (interaction: BaseInteraction) => Promise<void>;
					}
				).data.toJSON()
			);
		let data: unknown;
		const rest = new REST().setToken(token);
		try {
			await rest.put(Routes.applicationCommands(clientId), {
				body: commands
			});
		} catch (e) {
			reject(e);
		}
		resolve({
			data,
			getCommands: async () =>
				await rest.get(Routes.applicationCommands(clientId)),
			rest
		});
	});
}
