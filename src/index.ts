import {
	ActivityType,
	CategoryChannel,
	ChannelType,
	Events,
	ForumChannel,
	GatewayIntentBits,
	PresenceUpdateStatus,
	Snowflake,
	codeBlock,
	userMention
} from 'discord.js';
import { Command, CommandClient } from './struct/discord/Extend';
import { Method, createServer } from './server';
import { argv, cwd } from 'process';
import { Event } from './struct/discord/Structure';
import { InteractionHandlers } from './interactionHandlers';
// eslint-disable-next-line capitalized-comments
// import { TOKEN } from './TOKEN';
import TypedJsoning from 'typed-jsoning';
import { inviteLink } from './config';
import { join } from 'path';
import { logger } from './logger';
import { readdirSync } from 'fs';
import { scheduleJob } from 'node-schedule';

argv.shift();
argv.shift();
if (argv.includes('-d')) logger.level = 'debug';

logger.info('RunID: %d', Math.floor(Math.random() * 100));

const devdb = new TypedJsoning<Snowflake[]>('botfiles/dev.db.json');

const server = createServer(
	{
		handler: (_req, res) => res.redirect(inviteLink),
		method: Method.GET,
		route: '/invite'
	},
	{
		handler: (_req, res) =>
			res
				.status(200)
				.end(
					startDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
				),
		method: Method.GET,
		route: '/'
	}
);

const client = new CommandClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildScheduledEvents
	],

	// Set the bot's presence.
	presence: {
		activities: [
			{
				name: '/bday register',
				type: ActivityType.Playing
			}
		],
		afk: false,
		status: PresenceUpdateStatus.Online
	}
});

const commandsPath = join(cwd(), 'src', 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
	file.endsWith('.ts')
);
for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command: Command = await import(filePath);
	client.commands.set(command.data.name, command);
}
client.commands.freeze();

const eventsPath = join(cwd(), 'src', 'events');
const eventFiles = readdirSync(eventsPath).filter((file) =>
	file.endsWith('.ts')
);
for (const file of eventFiles) {
	const filePath = join(eventsPath, file);
	const event: Event = await import(filePath);
	if (event.once)
		client.once(event.name, async (...args) => await event.execute(...args));
	else client.on(event.name, async (...args) => await event.execute(...args));
}

// Keep in index
client
	.on(Events.ClientReady, () => logger.info('Client#ready'))
	.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.user.bot) return;
		if (
			devdb.get('blacklist')?.includes(interaction.user.id) &&
			interaction.isCommand()
		) {
			await interaction.reply({
				content: 'You are blacklisted from using this bot.',
				ephemeral: true
			});
			return;
		}
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
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

// eslint-disable-next-line capitalized-comments
// await client.login(TOKEN);
await client.login(process.env.TOKEN);

process.on('SIGINT', () => {
	client.destroy();
	logger.info('Destroyed Client.');
	process.exit(0);
});

const startDate = Object.freeze(new Date());

// Schedule the bdayInterval function to run every day at 12:00 AM PST for a server running 7 hours ahead of PST
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
scheduleJob('0 7 * * *', () => bdayInterval().catch((e) => logger.error(e)));

logger.info('Process setup complete.');

server.listen(8000);

async function bdayInterval() {
	const db = new TypedJsoning<string>('botfiles/bday.db.json');
	const today = new Date();
	const allBirthdays = Object.entries(db.all());
	const birthdaysToday = allBirthdays.filter(([, bday]) => {
		const bdaydate = new Date(bday);
		return (
			bdaydate.getMonth() == today.getMonth() &&
			bdaydate.getDate() == today.getDate()
		);
	});
	for (const [id] of birthdaysToday) {
		const user = await client.users.fetch(id);
		for (let guild of client.guilds.cache.values()) {
			guild = await guild.fetch();
			const birthdayChannels = guild.channels.cache.filter((channel) => {
				return !!(
					(channel.type == ChannelType.GuildAnnouncement ||
						channel.type == ChannelType.GuildText) &&
					(channel.name.toLowerCase().includes('bday') ||
						channel.name.toLowerCase().includes('birthday') ||
						channel.name.toLowerCase().includes('b-day'))
				);
			});
			const channel = birthdayChannels.first() || guild.systemChannel || null;
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
}
