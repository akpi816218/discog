import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
('use strict');
export const data = new ContextMenuCommandBuilder()
	.setName('User Info')
	.setType(ApplicationCommandType.User)
	.setDMPermission(true);
export default data;
