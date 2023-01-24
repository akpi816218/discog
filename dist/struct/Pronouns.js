export var PronounCodes;
(function (PronounCodes) {
	PronounCodes['theyThem'] = 'They/Them';
	PronounCodes['heHim'] = 'He/Him';
	PronounCodes['sheHer'] = 'She/Her';
	PronounCodes['other'] = 'Other';
})(PronounCodes || (PronounCodes = {}));
export function isPronounValue(s) {
	return s in PronounCodes;
}
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
			value: this.value,
		};
	}
	toString() {
		return this.value;
	}
}
export const DefaultPronouns = {
	theyThem: new Pronoun(PronounCodes.theyThem),
	heHim: new Pronoun(PronounCodes.theyThem),
	sheHer: new Pronoun(PronounCodes.sheHer),
	other: new Pronoun(PronounCodes.other),
};
export default DefaultPronouns;
