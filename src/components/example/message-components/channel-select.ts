import { ChannelType, ComponentType, MessageFlags } from '@discordjs/core';
import { ChannelSelect } from '../../data.js';

export const exampleChannelSelect = {
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
    async execute({ api, data: interaction }) {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The channel is: <#${interaction.data.values[0]!}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies ChannelSelect;
