import {
	ActivityType,
	CategoryChannel,
	ChannelType,
	ChatInputCommandInteraction,
	Client,
	Collection,
	Events,
	ForumChannel,
	GatewayIntentBits,
	PresenceUpdateStatus,
	SlashCommandBuilder,
	codeBlock,
	userMention
} from 'discord.js';
import { Request, Response } from 'express';
import { dirname, join } from 'path';
import { InteractionHandlers } from './interactionHandlers';
import Jsoning from 'jsoning';
import { TOKEN } from './TOKEN';
import { argv } from 'process';
// eslint-disable-next-line no-duplicate-imports
import express from 'express';
import { fileURLToPath } from 'url';
import { inviteLink } from './config';
import { logger } from './logger';
import { readdirSync } from 'fs';

argv.shift();
argv.shift();
if (argv.includes('-d')) logger.level = 'debug';

logger.info('RunID: %d', Math.floor(Math.random() * 100));

const devdb = new Jsoning('botfiles/dev.db.json');

const thisdirname = dirname(fileURLToPath(import.meta.url));

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
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildScheduledEvents
	],
	presence: {
		activities: [
			{
				name: '/tetrio',
				type: ActivityType.Playing
			}
		],
		afk: false,
		status: PresenceUpdateStatus.Online
	}
});

interface Command {
	data: SlashCommandBuilder;
	// eslint-disable-next-line no-unused-vars
	execute: (interaction: ChatInputCommandInteraction) => void;
}
const commandCollection = new Collection<string, Command>();

const commandsPath = join(thisdirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
	file.endsWith('.ts')
);
for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command: Command = await import(filePath);
	commandCollection.set(command.data.name, command);
}

const eventsPath = join(thisdirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) =>
	file.endsWith('.ts')
);
for (const file of eventFiles) {
	const filePath = join(eventsPath, file);
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
		if (interaction.user.bot) return;
		if (
			devdb.get('blacklist').includes(interaction.user.id) &&
			interaction.isCommand()
		) {
			await interaction.reply({
				content: 'You are blacklisted from using this bot.',
				ephemeral: true
			});
			return;
		}
		if (interaction.isChatInputCommand()) {
			const command = commandCollection.get(interaction.commandName);
			if (!command) {
				await interaction.reply('Internal error: Command not found');
				return;
			}
			try {
				await command.execute(interaction);
			} catch (e) {
				logger.error(e);
				if (interaction.replied || interaction.deferred) {
					await interaction.editReply(
						'There was an error while running this command.'
					);
				} else {
					await interaction.reply({
						content: 'There was an error while running this command.',
						ephemeral: true
					});
				}
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

async function bdayInterval(): Promise<void> {
	const db = new Jsoning('botfiles/bday.db.json');
	const today = new Date();
	const all: [string, Date][] = Object.entries(db.all());
	const bdaytoday = all.filter(([, bday]) => {
		const bdaydate = new Date(bday);
		return (
			bdaydate.getMonth() == today.getMonth() &&
			bdaydate.getDate() == today.getDate()
		);
	});
	for (const id of bdaytoday.map(([id]) => id)) {
		const user = await client.users.fetch(id);
		for (let guild of client.guilds.cache.values()) {
			guild = await guild.fetch();
			// eslint-disable-next-line no-extra-parens
			if (!(await guild.members.fetch(user.id))) continue;
			const bdaychannels = guild.channels.cache.filter((c) => {
				return !!(
					(c.type == ChannelType.GuildAnnouncement ||
						c.type == ChannelType.GuildText) &&
					(c.name.toLowerCase().includes('bday') ||
						c.name.toLowerCase().includes('birthday') ||
						c.name.toLowerCase().includes('b-day'))
				);
			});
			const channel = bdaychannels.first() || guild.systemChannel || null;
			if (
				!channel ||
				channel instanceof CategoryChannel ||
				channel instanceof ForumChannel
			)
				continue;

			const replies = [
				`Do you know what day it is? It's ${userMention(user.id)}'s birthday!`,
				`It's ${userMention(user.id)}'s birthday!`,
				`Time to celebrate ${userMention(user.id)}'s birthday!`,
				`Everyone wish ${userMention(user.id)} a happy birthday!`,
				`Happy birthday, ${userMention(user.id)}!`,
				`🎉${userMention(user.id)}🎉\n${codeBlock(
					`new Birthday({
	user: '${userMention(user.id)}',
	day: ${today.toLocaleDateString()}
});`
				)}`
			];
			await channel.send(replies[Math.floor(replies.length * Math.random())]);
		}
	}
	setTimeout(bdayInterval, 86_400_000);
}

bdayInterval().catch((e) => logger.error(e));
