import express, { Request, Response } from 'express';
import cors from 'cors';

export enum Methods {
	DELETE = 'delete',
	GET = 'get',
	HEAD = 'head',
	PATCH = 'patch',
	POST = 'post',
	PUT = 'put'
}

export interface Route {
	handler: (req: Request, res: Response) => void;
	method: Methods;
	route: string;
}

export function createServer(...routes: Route[]) {
	const app = express();
	for (const { handler, method, route } of routes) {
		app[method](route, handler);
	}
	// cors
	app.use(
		cors({
			origin: 'https://discog.localplayer.dev',
			methods: [Methods.DELETE, Methods.GET, Methods.PATCH].map(e =>
				e.toUpperCase()
			),
			maxAge: 86400,
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true
		})
	);
	return app;
}
