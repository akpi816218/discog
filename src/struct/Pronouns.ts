/* eslint-disable no-unused-vars */
export enum PronounCodes {
	// When changing this also change array in isPronounValue
	any = 'Any',
	heHim = 'He/Him',
	other = 'Other',
	sheHer = 'She/Her',
	theyThem = 'They/Them'
}

export type PronounValue = PronounCodes | `CustomPronoun:${string}/${string}`;

export function isPronounValue(s: string): s is PronounCodes {
	return (
		['Any', 'He/Him', 'Other', 'She/Her', 'They/Them'].includes(s) ||
		/^CustomPronoun\:[A-Z][a-z]+(\/[A-Z][a-z]+)+$/.test(s)
	);
}

export interface PronounObject {
	code: PronounCodes;
	prnnbjct: 'PronounObject';
	value?: PronounValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPronounObject(o: any): o is PronounObject {
	return 'prnnbjct' in o;
}

export class Pronoun {
	code: PronounCodes;
	custom: boolean;
	value: PronounValue;
	constructor(code: PronounCodes, value?: PronounValue) {
		this.code = code;
		if (value && this.code != PronounCodes.other)
			throw new Error(
				"Cannot accept 'value' parameter because 'code' parameter is not equal to 'PronounCodes.other'"
			);
		else {
			this.value = value || this.code;
		}
		this.custom = !!value;
	}
	static fromJSON(json: PronounObject) {
		if (json.value) {
			return new Pronoun(json.code);
		} else return new Pronoun(json.code, json.value);
	}
	toJSON(): PronounObject {
		return {
			code: this.code,
			prnnbjct: 'PronounObject',
			value: this.value
		};
	}
	toString() {
		if (this.custom) return this.value.slice(14);
		else return this.value;
	}
}

export const DefaultPronouns = {
	any: new Pronoun(PronounCodes.any),
	heHim: new Pronoun(PronounCodes.heHim),
	other: new Pronoun(PronounCodes.other),
	sheHer: new Pronoun(PronounCodes.sheHer),
	theyThem: new Pronoun(PronounCodes.theyThem)
};
export default DefaultPronouns;
