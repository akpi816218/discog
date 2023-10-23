import express, { Request, Response } from 'express';
import cors from 'cors';

export enum Methods {
	// eslint-disable-next-line no-unused-vars
	DELETE = 'delete',
	// eslint-disable-next-line no-unused-vars
	GET = 'get',
	// eslint-disable-next-line no-unused-vars
	POST = 'post',
	// eslint-disable-next-line no-unused-vars
	PUT = 'put'
}

export interface Route {
	// eslint-disable-next-line no-unused-vars
	handler: (req: Request, res: Response) => void;
	method: Methods;
	route: string;
}

export function createServer(...routes: Route[]) {
	const app = express();
	app.use(cors());
	for (const { handler, method, route } of routes) {
		app[method](route, handler);
	}
	return app;
}
