import { createEthereumScenario } from '../../src/ethereum-scenario';
import { describeSetupActions, executeSetupActions } from '../../src/setup-actions';
import { StateTestAction } from '../action/StateTest';
import { StateTest } from '../contracts-ts/StateTest';

export function createStateTestScenario({ value, only, setupActions = [] }: {
    only?: boolean;
    value: bigint;
    setupActions?: StateTestAction[],
}) {
    return {
        value,

        ...createEthereumScenario({
            only,

            description: `add ${value}${describeSetupActions(setupActions)}`,

            async setup(ctx) {
                ctx.addContext('value', value);
                const contract = await StateTest.deploy();
                const state = { value: 0n };
                await executeSetupActions(setupActions, { ...ctx, contract, state });
                return {
                    ...ctx,
                    contract,
                    state,
                    execute: () => contract.add(value),
                    executeStatic: () => contract.callStatic.add(value),
                };
            },
        })
    };
}
