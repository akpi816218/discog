import { inlineCode, SlashCommandBuilder, } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
    .setName('randint')
    .setDescription('Generates an integer between 1 and a specified integer (inclusive)')
    .addIntegerOption((option) => {
    return option
        .setName('high')
        .setDescription('The highest possible integer (inclusive)')
        .setRequired(true);
});
export const execute = async (interaction) => {
    let number, high = interaction.options.getInteger('high');
    if (!high)
        number = Math.random();
    else
        number = Math.round(Math.random() * high);
    await interaction.reply(inlineCode(number.toString()));
};
export default {
    data,
    execute,
};
