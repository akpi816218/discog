import { Client, ClientOptions } from 'discord.js';
import { Collection } from '@discordjs/collection';

/**
    export
*/ class ExtendedCollection<K, V> extends Collection<K, V> {
	constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
		super(entries);
	}

	freeze() {
		return Object.freeze(this);
	}
}

export class CommandClient extends Client {
	commands: ExtendedCollection<string, any>;
	guildCommands: ExtendedCollection<string, ExtendedCollection<string, any>>;

	constructor(options: ClientOptions) {
		super(options);
		this.commands = new ExtendedCollection();
		this.guildCommands = new ExtendedCollection();
	}

	setGuildCommand(guildId: string, commandName: string, command: any) {
		if (!this.guildCommands.has(guildId))
			this.guildCommands.set(guildId, new ExtendedCollection());
		this.guildCommands.get(guildId)!.set(commandName, command);
	}

	getGuildCommand(guildId: string, commandName: string) {
		return this.guildCommands.get(guildId)?.get(commandName);
	}
}
