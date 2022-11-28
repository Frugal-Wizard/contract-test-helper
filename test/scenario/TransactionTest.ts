import { createEthereumScenario } from '../../src/ethereum-scenario';
import { describeSetupActions, executeSetupActions } from '../../src/setup-actions';
import { TransactionTestAction } from '../action/TransactionTest';
import { TransactionTest } from '../contracts-ts/TransactionTest';

export function createTransactionTestScenario({ value, only, setupActions = [] }: {
    only?: boolean;
    value: bigint;
    setupActions?: TransactionTestAction[],
}) {
    return {
        value,

        ...createEthereumScenario({
            only,

            description: `add ${value}${describeSetupActions(setupActions)}`,

            async setup(ctx) {
                ctx.addContext('value', value);
                const contract = await TransactionTest.deploy();
                await executeSetupActions(setupActions, { ...ctx, contract });
                return {
                    ...ctx,
                    contract,
                    execute: () => contract.add(value),
                };
            },
        })
    };
}
