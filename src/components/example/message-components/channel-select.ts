import { ChannelType, ComponentType } from 'discord.js';
import { ChannelSelect } from '../../data.js';

export default {
    data: {
        type: ComponentType.ChannelSelect,
        custom_id: 'channel_select_example',
        channel_types: [
            ChannelType.GuildText,
            ChannelType.GuildVoice,
            ChannelType.GuildAnnouncement,
            ChannelType.AnnouncementThread,
            ChannelType.PublicThread,
            ChannelType.PrivateThread,
            ChannelType.GuildStageVoice,
            ChannelType.GuildDirectory,
            ChannelType.GuildForum,
        ],
        max_values: 1,
    },
    async execute(interaction) {
        await interaction.reply({
            content: `The channel is: <#${interaction.values[0]}>`,
            ephemeral: true,
        });
    },
} satisfies ChannelSelect;
