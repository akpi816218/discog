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

// We are creating a command handler, which will be called when our command is executed.
// The command handler is an async function that takes one argument: the interaction that triggered the command.
export type CommandExecuteHandler = (
	// The interaction object contains information about the command execution, including the command's arguments.
	// eslint-disable-next-line no-unused-vars
	interaction: ChatInputCommandInteraction
) => Promise<void>;
export interface Command {
	// The command to register with Discord
	data: SlashCommandBuilder;

	// The function to run when the command is executed
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
