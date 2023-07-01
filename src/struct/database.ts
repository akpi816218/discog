import { GenderCodes, PronounObject } from 'pronouns.js';

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

export interface AuditLogDatabaseEntry {
	id: string;
}
