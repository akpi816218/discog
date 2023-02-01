/* eslint-disable no-unused-vars */
export var PronounCodes;
(function (PronounCodes) {
	PronounCodes['heHim'] = 'He/Him';
	PronounCodes['other'] = 'Other';
	PronounCodes['sheHer'] = 'She/Her';
	PronounCodes['theyThem'] = 'They/Them';
})(PronounCodes || (PronounCodes = {}));
export function isPronounValue(s) {
	return s in PronounCodes;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPronounObject(o) {
	return 'prnnbjct' in o;
}
export class Pronoun {
	code;
	value;
	constructor(code, value) {
		this.code = code;
		if (value && this.code != PronounCodes.other)
			throw new Error(
				"Cannot accept 'value' parameter because 'code' parameter is not equal to 'PronounCodes.other'"
			);
		else this.value = value || this.code;
	}
	static fromJSON(json) {
		if (json.value) {
			return new Pronoun(json.code);
		} else return new Pronoun(json.code, json.value);
	}
	toJSON() {
		return {
			code: this.code,
			value: this.value
		};
	}
	toString() {
		return this.value;
	}
}
export const DefaultPronouns = {
	heHim: new Pronoun(PronounCodes.theyThem),
	other: new Pronoun(PronounCodes.other),
	sheHer: new Pronoun(PronounCodes.sheHer),
	theyThem: new Pronoun(PronounCodes.theyThem)
};
export default DefaultPronouns;
