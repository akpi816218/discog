import { EmbedBuilder, inlineCode, PermissionFlagsBits, SlashCommandBuilder, userMention, } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption((option) => {
    return option
        .setName('user')
        .setDescription('The user to timeout')
        .setRequired(true);
})
    .addStringOption((option) => {
    return option
        .setName('reason')
        .setDescription('Reason for timeout')
        .setRequired(true);
})
    .addBooleanOption((option) => {
    return option
        .setName('toggle')
        .setDescription('Toggle on (False => off)?')
        .setRequired(false);
})
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);
export const execute = async (interaction) => {
    let user = interaction.member, user2 = interaction.options.getUser('user');
    if (!user || !user2 || !interaction.guild)
        throw new Error();
    let member = await interaction.guild.members.fetch(user2.id.toString());
    if (!member.manageable) {
        await interaction.reply({
            content: "I can't manage that user.",
            ephemeral: true,
        });
        return;
    }
    else if (user.roles.highest.position <=
        member.roles.highest.position) {
        await interaction.reply({
            content: "You can't manage that user",
            ephemeral: true,
        });
        return;
    }
    else {
        let toggle = interaction.options.getBoolean('toggle') || true;
        if (!toggle)
            member.timeout(null, interaction.options.getString('reason'));
        else
            member.timeout(interaction.options.getInteger('duration') * 1000, interaction.options.getString('reason'));
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('User Timeout Toggled')
                    .addFields({ name: 'Acting User:', value: userMention(user.user.id) }, { name: 'Modified User:', value: userMention(member.user.id) }, {
                    name: 'Currently Timed Out?',
                    value: toggle ? inlineCode('true') : inlineCode('false'),
                })
                    .setFooter({
                    text: 'Powered by DisCog',
                    iconURL: interaction.client.user.displayAvatarURL(),
                }),
            ],
        });
    }
};
export default {
    data,
    execute,
};
