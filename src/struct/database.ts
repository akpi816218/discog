import { GenderCodes, PronounObject } from 'pronouns.js';

export type IdentityEntry = {
	bio?: string | null;
	gender: { bits: GenderCodes[] } | null;
	name?: string | null;
	pronouns: PronounObject | null;
	orientation?: string | null;
};
