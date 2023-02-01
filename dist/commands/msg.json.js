import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
export const data = new ContextMenuCommandBuilder()
	.setName('JSON')
	.setType(ApplicationCommandType.Message)
	.setDMPermission(true);
export default data;
