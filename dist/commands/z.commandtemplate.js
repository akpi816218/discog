import { SlashCommandBuilder } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
    .setName('name')
    .setDescription('description');
export const execute = async (interaction) => {
    await interaction.reply('reply message');
};
export default {
    data,
    execute,
};
