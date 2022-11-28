import { SetupAction } from '../../src/setup-actions';
import { StateTest } from '../contracts-ts/StateTest';

interface State {
    value: bigint;
}

export interface StateTestActionContext {
    contract: StateTest;
    state: State;
}

export interface StateTestAction extends SetupAction<StateTestActionContext> {
    apply(state: State): void;
}

export function createStateTestAddAction({ value }: {
    value: bigint;
}): StateTestAction {
    return {
        description: `add ${value}`,

        apply(state) {
            state.value += value;
        },

        async execute(ctx) {
            await ctx.contract.add(value);
            this.apply(ctx.state);
        },
    };
}

export function createStateTestSubtractAction({ value }: {
    value: bigint;
}): StateTestAction {
    return {
        description: `subtract ${value}`,

        apply(state) {
            if (state.value < value) throw new Error('underflow');
            state.value -= value;
        },

        async execute(ctx) {
            await ctx.contract.subtract(value);
            this.apply(ctx.state);
        },
    };
}
