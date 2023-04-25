import {
	ChatInputCommandInteraction,
	Client,
	ClientOptions,
	Collection,
	SlashCommandBuilder
} from 'discord.js';
import { ReadonlyCollection } from '@discordjs/collection';

export class ExtendedCollection<K, V> extends Collection<K, V> {
	constructor(entries?: readonly (readonly [K, V])[] | null) {
		super(entries);
	}
	public freeze(): ReadonlyCollection<K, V> {
		return Object.freeze(this);
	}
}

export type CommandExecuteHandler = (
	// eslint-disable-next-line no-unused-vars
	interaction: ChatInputCommandInteraction
) => Promise<void>;
export interface Command {
	data: SlashCommandBuilder;
	execute: CommandExecuteHandler;
}

export class ExtendedClient extends Client {
	commands: ExtendedCollection<string, Command>;
	constructor(options: ClientOptions) {
		super(options);
		this.commands = new ExtendedCollection<string, Command>();
	}
}

export { ExtendedClient as CommandClient };
