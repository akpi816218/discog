('use strict');
import { EmbedBuilder, Events, userMention, } from 'discord.js';
export const name = Events.GuildBanAdd;
export const once = false;
export const execute = async (ban) => {
    if (ban.guild.systemChannel)
        await ban.guild.systemChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Ban Created')
                    .setFields({ name: 'User:', value: userMention(ban.user.id) }, { name: 'Reason:', value: ban.reason }),
            ],
        });
};
export default {
    name,
    once,
    execute,
};
