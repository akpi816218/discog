import express, { Request, Response } from 'express';

export enum Methods {
	DELETE = 'delete',
	GET = 'get',
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
	return app;
}
