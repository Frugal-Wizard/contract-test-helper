import { getAccounts, ZERO_ADDRESS } from '@frugalwizard/abi2ts-lib';
import { setUpEthereumProvider, tearDownEthereumProvider } from './provider';
import { createTestScenario, TestSetupContext, TestScenario, TestScenarioProperties } from './scenario';

export enum Account {
    MAIN    = 'mainAccount',
    SECOND  = 'secondAccount',
    THIRD   = 'thirdAccount',
    FOURTH  = 'fourthAccount',
    FIFTH   = 'fifthAccount',
    SIXTH   = 'sixthAccount',
    SEVENTH = 'seventhAccount',
    EIGHTH  = 'eighthAccount',
    NINTH   = 'ninthAccount',
    TENTH   = 'tenthAccount',
}

export enum Addresses {
    ZERO   = 'zeroAddress',
    RANDOM = 'randomAddress',
}

export type EthereumSetupContext = {
    [account in Account]: string;
} & {
    [address in Addresses]: string;
} & {
    accounts: string[];
};

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
            const [
                mainAccount,
                secondAccount,
                thirdAccount,
                fourthAccount,
                fifthAccount,
                sixthAccount,
                seventhAccount,
                eighthAccount,
                ninthAccount,
                tenthAccount,
            ] = accounts;
            const zeroAddress = ZERO_ADDRESS;
            const randomAddress = '0x1000000000000000000000000000000000000000';
            return await setup({
                ...ctx,
                accounts,
                mainAccount,
                secondAccount,
                thirdAccount,
                fourthAccount,
                fifthAccount,
                sixthAccount,
                seventhAccount,
                eighthAccount,
                ninthAccount,
                tenthAccount,
                zeroAddress,
                randomAddress,
            });
        },

        async teardown() {
            if (teardown) await teardown();
            await tearDownEthereumProvider();
        },
    });
}
