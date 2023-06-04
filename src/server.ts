import express, { Request, Response } from 'express';

export enum Method {
	// eslint-disable-next-line no-unused-vars
	DELETE = 'delete',
	// eslint-disable-next-line no-unused-vars
	GET = 'get',
	// eslint-disable-next-line no-unused-vars
	POST = 'post',
	// eslint-disable-next-line no-unused-vars
	PUT = 'put'
}

export function createServer(
	...routes: {
		// eslint-disable-next-line no-unused-vars
		handler: (req: Request, res: Response) => void;
		method: Method;
		route: string;
	}[]
) {
	const app = express();
	for (const { handler, method, route } of routes) {
		app[method](route, handler);
	}
	return app;
}