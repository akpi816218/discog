// eslint-disable-next-line no-unused-vars
export type EventExecuteHandler = (...args: unknown[]) => Promise<void>;
export interface Event {
	name: string;
	once: boolean;
	execute: EventExecuteHandler;
}
