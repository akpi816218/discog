import { GenderCodes, PronounObject } from 'pronouns.js';
import { Snowflake } from 'discord.js';

export interface IdentityEntry {
	bio?: string | null;
	gender: { bits: GenderCodes[] } | null;
	name?: string | null;
	pronouns: PronounObject | null;
	orientation?: string | null;
}

export type JSONValue =
	| string
	| number
	| boolean
	| {
			[x: string]: JSONValue;
	  }
	| JSONValue[]
	| null;

export interface GuildConfig {
	auditlog?:
		| {
				enabled: true;
				channel: Snowflake;
		  }
		| {
				enabled?: false | null;
				channel?: null;
		  };
	birthdays?:
		| {
				enabled: true;
				channel: Snowflake;
		  }
		| {
				enabled?: false | null;
				channel?: null;
		  };
	greetings?: {
		goodbyeEnabled?: boolean | null;
		welcome?:
			| {
					enabled: true;
					channel: Snowflake;
			  }
			| {
					enabled?: false | null;
					channel?: null;
			  };
	};
	systemchannel?: Snowflake | null;
}
