import { Response } from 'node-fetch';
import { UserData } from './UserData';
// eslint-disable-next-line no-duplicate-imports
import fetch from 'node-fetch';

export const API_BASE = 'https://ch.tetr.io/api';

export async function getUser(
	username: string,
	XSessionID: string
): Promise<UserData> {
	return new Promise((resolve, reject) => {
		fetch(`${API_BASE}/users/${username.toLowerCase()}`, {
			headers: {
				'X-Session-ID': XSessionID
			}
		})
			.then((response: Response) => response.json() as Promise<UserData>)
			.then((userData: UserData) => resolve(userData))
			.catch((error: unknown) => reject(error));
	});
}

export async function userFromDiscord(
	discordID: string,
	XSessionID: string
): Promise<UserData> {
	const json = (await (
		await fetch(`${API_BASE}/users/search/${discordID}`, {
			headers: {
				'X-Session-ID': XSessionID
			}
		})
	).json()) as UserData;
	if (!json.success || !json.data) {
		const error = json.error ?? 'No user found';
		throw new Error(error);
	}
	return getUser(json.data.user.username, XSessionID);
}
