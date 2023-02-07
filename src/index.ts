import {
	ActivityType,
	ChatInputCommandInteraction,
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	PresenceUpdateStatus,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';
import { Request, Response } from 'express';
import { InteractionHandlers } from './interactionHandlers.js';
import { TOKEN } from './TOKEN.js';
// eslint-disable-next-line no-duplicate-imports
import express from 'express';
import { fileURLToPath } from 'url';
import { inviteLink } from './config.js';
import { logger } from './logger.js';
import path from 'path';
import { readdirSync } from 'fs';

logger.info('RunID: %d', Math.floor(Math.random() * 100));

const thisdirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/', (_req: Request, res: Response) => {
	res.status(200).end();
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/invite', (_req: Request, res: Response) => {
	res.redirect(inviteLink);
});

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildScheduledEvents
	],
	presence: {
		activities: [
			{ name: inlineCode('/gpt'), type: ActivityType.Listening },
			{
				name: 'equus quagga',
				type: ActivityType.Streaming,
				url: 'https://youtube.com/@equus_quagga'
			}
		],
		afk: false,
		status: PresenceUpdateStatus.Online
	}
});

client.on('debug', logger.debug).on('warn', logger.warn);

const g = {
	commands: new Collection()
};

const commandsPath = path.join(thisdirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
	file.endsWith('.js')
);
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	g.commands.set(command.data.name, command);
}

const eventsPath = path.join(thisdirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) =>
	file.endsWith('.js')
);
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = await import(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Keep in index
client
	.on(Events.ClientReady, () => logger.info('Client#ready'))
	.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.isChatInputCommand()) {
			interface Command {
				data: SlashCommandBuilder;
				// eslint-disable-next-line no-unused-vars
				execute: (interaction: ChatInputCommandInteraction) => unknown;
			}
			const command = g.commands.get(interaction.commandName) as Command;
			try {
				await command.execute(interaction);
			} catch (e) {
				logger.error(e);
				await interaction.reply({
					content: 'There was an error while running this command.',
					ephemeral: true
				});
			}
		} else if (interaction.isModalSubmit())
			InteractionHandlers.ModalSubmit(interaction);
		else if (interaction.isButton()) InteractionHandlers.Button(interaction);
		else if (interaction.isUserContextMenuCommand())
			InteractionHandlers.ContextMenu.User(interaction);
		else if (interaction.isMessageContextMenuCommand())
			InteractionHandlers.ContextMenu.Message(interaction);
		else if (interaction.isStringSelectMenu())
			InteractionHandlers.StringSelectMenu(interaction);
	})
	.on(Events.Debug, (m) => logger.debug(m))
	.on(Events.Error, (m) => logger.error(m))
	.on(Events.Warn, (m) => logger.warn(m));

await client.login(TOKEN);

process.on('SIGINT', () => {
	client.destroy();
	logger.info('Destroyed Client.');
	process.exit(0);
});

app.listen(8000);
