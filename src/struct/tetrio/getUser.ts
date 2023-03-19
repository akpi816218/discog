import { Response } from 'node-fetch';
import { UserData } from './UserData';
// eslint-disable-next-line no-duplicate-imports
import fetch from 'node-fetch';

export const base = 'https://ch.tetr.io/api';

export async function getUser(
	username: string,
	XSessionID: string
): Promise<UserData> {
	return new Promise((resolve, reject) => {
		fetch(`${base}/users/${username.toLowerCase()}`, {
			headers: {
				'X-Session-ID': XSessionID
			}
		})
			.then((res: Response) => res.json() as Promise<UserData>)
			.then((json) => resolve(json))
			.catch((e: unknown) => reject(e));
	});
}

export async function userFromDiscord(
	discordID: string,
	XSessionID: string
): Promise<UserData> {
	return new Promise((resolve, reject) => {
		fetch(`${base}/users/search/${discordID}`, {
			headers: {
				'X-Session-ID': XSessionID
			}
		})
			.then(
				(res: Response) =>
					res.json() as Promise<{
						success: boolean;
						error?: string;
						data: {
							user: { id: string; username: string };
						} | null;
						cache?: {
							status: 'hit' | 'miss' | 'awaited';
							cached_at: number;
							cached_until: number;
						};
					}>
			)
			.then(async (json) => {
				if (!json.success || !json.data) reject(json.error ?? 'No user found');
				else resolve(await getUser(json.data.user.username, XSessionID));
			})
			.catch((e: unknown) => reject(e));
	});
}
