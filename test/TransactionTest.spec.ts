import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { DefaultOverrides } from '@frugal-wizard/abi2ts-lib';
import { transactionTestScenarios } from './scenarios/TransactionTest';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('TransactionTest', () => {
    for (const scenario of transactionTestScenarios) {
        scenario.describe(({ it }) => {
            it('should add the provided value', async (test) => {
                const prevValue = await test.contract.value();
                await test.execute();
                expect(await test.contract.value())
                    .to.be.equal(prevValue + scenario.value);
            });
        });
    }
});
