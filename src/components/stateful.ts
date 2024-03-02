import { Awaitable } from '@discordjs/util';
import { MessageComponent, Modal } from './data.js';

type StatefulInteractionType = MessageComponent | Modal;

type ExecuteArgs<T extends StatefulInteractionType> = Parameters<
    T['execute']
>[0];

type StatefulExecuteArgs<T extends StatefulInteractionType> = ExecuteArgs<T> & {
    state: string;
};

export type StatefulInteraction<T extends StatefulInteractionType> = T & {
    readonly stateful: (state: string) => T['data'];
};

export const isStatefulInteraction = <T extends StatefulInteractionType>(
    interaction: T,
): interaction is StatefulInteraction<T> => {
    return (
        'stateful' in interaction && typeof interaction.stateful === 'function'
    );
};

// This one is in complete type hell...
export const createStatefulInteraction = <T extends StatefulInteractionType>(
    interaction: Omit<T, 'execute'> & {
        readonly execute: (props: StatefulExecuteArgs<T>) => Awaitable<void>;
    },
): StatefulInteraction<T> =>
    ({
        data: interaction.data,
        async execute(props: ExecuteArgs<T>) {
            const state = props.data.data.custom_id.replace(
                interaction.data.custom_id,
                '',
            );
            await interaction.execute({ ...props, state });
        },
        stateful(state: string) {
            const newData = structuredClone(interaction.data);
            newData.custom_id += state;
            return newData;
        },
    }) as unknown as StatefulInteraction<T>;
