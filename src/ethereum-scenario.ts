import { getAccounts } from '@frugal-wizard/abi2ts-lib';
import { setUpEthereumProvider, tearDownEthereumProvider } from './provider';
import { createTestScenario, TestSetupContext, TestScenario, TestScenarioProperties } from './scenario';

export enum Account {
    MAIN = 'mainAccount',
    SECOND = 'secondAccount',
    THIRD = 'thirdAccount',
}

type Accounts = { [account in Account]: string };

export interface EthereumSetupContext extends Accounts {
    accounts: string[];
}

export type EthereumScenarioProperties<TestContext> =
    Omit<TestScenarioProperties<TestContext>, 'setup'> & {
        setup(ctx: TestSetupContext & EthereumSetupContext): TestContext | Promise<TestContext>;
    };

export type EthereumScenario<Context> = TestScenario<Context>;

export function createEthereumScenario<TestContext>(props: EthereumScenarioProperties<TestContext>): EthereumScenario<TestContext> {
    const { setup, teardown, ...rest } = props;

    return createTestScenario({
        ...rest,

        async setup(ctx) {
            await setUpEthereumProvider();
            const accounts = await getAccounts();
            const [ mainAccount, secondAccount, thirdAccount ] = accounts;
            return await setup({ ...ctx, accounts, mainAccount, secondAccount, thirdAccount });
        },

        async teardown() {
            if (teardown) await teardown();
            await tearDownEthereumProvider();
        },
    });
}
