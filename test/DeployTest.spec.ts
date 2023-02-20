import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { DefaultOverrides } from '@frugalwizard/abi2ts-lib';
import { deployTestScenarios } from './scenarios/DeployTest';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('DeployTest', () => {
    for (const scenario of deployTestScenarios) {
        scenario.describe(({ it }) => {
            it('should deploy with provided value', async (test) => {
                const contract = await test.execute();
                expect(await contract.value())
                    .to.be.equal(scenario.value);
            });
        });
    }
});
