('use strict');
import { Events, userMention } from 'discord.js';
export const name = Events.GuildMemberRemove;
export const once = false;
export const execute = async (member) => {
    if (member.guild.systemChannel)
        await member.guild.systemChannel.send(`${member.user.tag} (${userMention(member.id)}) just poofed.`);
};
export default {
    name,
    once,
    execute,
};
