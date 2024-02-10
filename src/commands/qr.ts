import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	SlashCommandBuilder
} from 'discord.js';
import { QRCodeSegment, create, toBuffer } from 'qrcode';

export const data = new SlashCommandBuilder()
	.setName('qr')
	.setDescription('Generate a QR code from a message or link')
	.addStringOption(option => {
		return option
			.setName('text')
			.setDescription('The text/link to encode')
			.setRequired(true);
	})
	.addBooleanOption(option => {
		return option
			.setName('ephemeral')
			.setDescription('Whether the reply should be ephemeral')
			.setRequired(false);
	});

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		content: 'Generating QR code...',
		ephemeral: interaction.options.getBoolean('ephemeral') ?? false
	});
	await interaction.editReply({
		content: 'Successfully generated a QR code!',
		files: [
			new AttachmentBuilder(
				await toBuffer(
					create(interaction.options.getString('text', true))
						.segments as unknown as QRCodeSegment[]
				),
				{
					description: 'QR code generated by the /qr command',
					name: 'qr.png'
				}
			)
		]
	});
};
