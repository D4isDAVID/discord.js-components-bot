import {
    APIApplicationCommandBasicOption,
    APIApplicationCommandInteractionDataBasicOption,
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandSubcommandOption,
    APIChatInputApplicationCommandInteractionData,
    APIModalSubmission,
    ApplicationCommandOptionType,
} from '@discordjs/core';

type MappedChatInputOptionValues = Record<string, string | number | boolean>;

const isBasicOption = (
    option:
        | APIApplicationCommandInteractionDataOption
        | APIApplicationCommandBasicOption,
): option is APIApplicationCommandInteractionDataBasicOption =>
    [
        ApplicationCommandOptionType.Attachment,
        ApplicationCommandOptionType.Boolean,
        ApplicationCommandOptionType.Channel,
        ApplicationCommandOptionType.Integer,
        ApplicationCommandOptionType.Mentionable,
        ApplicationCommandOptionType.Number,
        ApplicationCommandOptionType.Role,
        ApplicationCommandOptionType.String,
        ApplicationCommandOptionType.User,
    ].includes(option.type);

const mapChatInputOptionValues = ({
    options,
}:
    | APIChatInputApplicationCommandInteractionData
    | APIApplicationCommandSubcommandOption) => {
    const values: MappedChatInputOptionValues = {};
    if (options)
        for (const option of options) {
            if (!isBasicOption(option)) continue;
            values[option.name] = option.value;
        }
    return values;
};

const mapModalTextInputValues = ({ components }: APIModalSubmission) => {
    const values: Record<string, string> = {};
    for (const {
        components: [textInput],
    } of components)
        values[textInput!.custom_id] = textInput!.value;
    return values;
};

export { mapChatInputOptionValues, mapModalTextInputValues };
