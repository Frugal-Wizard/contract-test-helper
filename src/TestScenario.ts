import { setUpEthereumProvider, tearDownEthereumProvider } from './provider';
import { describeError, Describer, describeWith } from './describer';
import { AddContextFunction, TestScenarioBase } from './TestScenarioBase';
import { TestSetupAction } from './TestSetupAction';
import { getAccounts } from '@theorderbookdex/abi2ts-lib';

export enum Account {
    MAIN = 'mainAccount',
    SECOND = 'secondAccount',
    THIRD = 'thirdAccount',
}

type Accounts = { readonly [account in Account]: string };

export interface BaseTestContext extends Accounts {
    readonly accounts: ReadonlyArray<string>;
}

export type TestError = string | { new(...args: unknown[]): Error };

export interface TestScenarioProperties<TestContext extends BaseTestContext> {
    readonly only?: boolean;
    readonly describer: Describer;
    readonly expectedError?: TestError;
    readonly setupActions?: ReadonlyArray<TestSetupAction<TestContext>>;
}

export abstract class TestScenario<TestContext extends BaseTestContext, ExecuteResult, ExecuteStaticResult>
    extends TestScenarioBase<TestContext, ExecuteResult, ExecuteStaticResult>
{
    readonly only: boolean;
    readonly describer: Describer;
    readonly expectedError?: TestError;
    readonly setupActions: ReadonlyArray<TestSetupAction<TestContext>>;

    get description() {
        return describeWith(this.describer, this);
    }

    constructor({ only = false, describer, expectedError, setupActions = [] }: TestScenarioProperties<TestContext>) {
        super();
        this.only = only;
        this.describer = describer;
        this.expectedError = expectedError;
        this.setupActions = setupActions;
    }

    addContext(addContext: AddContextFunction) {
        if (this.expectedError) {
            addContext('expected error', describeError(this.expectedError));
        }
        if (this.setupActions.length) {
            addContext('setup', this.setupActions.map(action => action.description).join('\n'));
        }
    }

    protected async _setup(): Promise<BaseTestContext> {
        await setUpEthereumProvider();
        const accounts = await getAccounts() as ReadonlyArray<string>;
        const [ mainAccount, secondAccount, thirdAccount ] = accounts;
        return {
            accounts,
            mainAccount,
            secondAccount,
            thirdAccount,
        };
    }

    async afterSetup(ctx: TestContext) {
        for (const setupAction of this.setupActions) {
            await setupAction.execute(ctx);
        }
    }

    async teardown() {
        await tearDownEthereumProvider();
    }
}
