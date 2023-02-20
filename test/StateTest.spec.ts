import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { DefaultOverrides } from '@frugalwizard/abi2ts-lib';
import { stateTestScenarios } from './scenarios/StateTest';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('StateTest', () => {
    for (const scenario of stateTestScenarios) {
        scenario.describe(({ it }) => {
            it('should add the provided value', async (test) => {
                expect(await test.executeStatic())
                    .to.be.equal(test.state.value + scenario.value);
            });
        });
    }
});
