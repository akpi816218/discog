import { Events } from 'discord.js';
('use strict');
// ! Add event property
export const name = Events;
export const once = false;
export const execute = async (o) => {
    console.log(o);
};
export default {
    name,
    once,
    execute,
};
