import { ChannelType, ComponentType, MessageFlags } from '@discordjs/core';
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
    async execute({ api, data: interaction }) {
        const channel =
            interaction.data.resolved.channels[interaction.data.values[0]!]!;

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `The channel is: <#${channel.id}>`,
            flags: MessageFlags.Ephemeral,
        });
    },
} satisfies ChannelSelect;
