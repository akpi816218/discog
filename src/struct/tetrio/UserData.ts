/* eslint-disable no-extra-parens */
export interface UserData {
	success: boolean;
	error?: string;
	cache?: object;
	data?: {
		user: {
			_id: string;
			username: string;
			role: 'anon' | 'user' | 'bot' | 'mod' | 'admin' | 'banned';
			ts?: string;
			badges: [];
			xp: number;
			gamesplayed: number;
			gameswon: number;
			gametime: number;
			country: string | null;
			badstanding?: boolean;
			supporter?: boolean;
			supporter_tier: number;
			verified: boolean;
			league: {
				gamesplayed: number;
				gameswon: number;
				rating: number;
				rank: string;
				bestrank: string;
				standing: number;
				standing_local: number;
				next_rank?: string;
				prev_rank?: string;
				next_at: number;
				prev_at: number;
				percentile: number;
				percentile_rank: string;
				glicko?: number;
				rd?: number;
				apm?: number;
				pps?: number;
				vs?: number;
				decaying: boolean;
			};
			avatar_revision?: number;
			connections: object;
			friend_count: number;
			distinguishment?: object;
		};
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUserData(o: any): o is UserData {
	return (
		(o.success &&
			o.data.user &&
			// eslint-disable-next-line no-underscore-dangle
			typeof o.data.user._id == 'string' &&
			typeof o.data.user.username == 'string' &&
			typeof o.data.user.role == 'string' &&
			typeof o.data.user.xp == 'number' &&
			typeof o.data.user.gamesplayed == 'number' &&
			typeof o.data.user.gameswon == 'number' &&
			typeof o.data.user.gametime == 'number' &&
			typeof o.data.user.league.gamesplayed == 'number' &&
			typeof o.data.user.league.gameswon == 'number' &&
			typeof o.data.user.league.rating == 'number' &&
			typeof o.data.user.league.rank == 'string' &&
			typeof o.data.user.league.percentile == 'number' &&
			typeof o.data.user.friend_count == 'number') ||
		(!o.success && o.error)
	);
}
