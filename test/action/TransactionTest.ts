import { SetupAction } from '../../src/setup-actions';
import { TransactionTest } from '../contracts-ts/TransactionTest';

export interface TransactionTestActionContext {
    contract: TransactionTest;
}

export type TransactionTestAction = SetupAction<TransactionTestActionContext>;

export function createTransactionTestAddAction({ value }: {
    value: bigint;
}): TransactionTestAction {
    return {
        description: `add ${value}`,

        async execute({ contract }) {
            await contract.add(value);
        },
    };
}
