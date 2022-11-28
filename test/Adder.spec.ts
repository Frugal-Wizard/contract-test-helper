// example used in README

import { TransactionTest as Adder } from './contracts-ts/TransactionTest';
import { SetupAction, createEthereumScenario, describeSetupActions, executeSetupActions, generatorChain, range } from '../src/contract-test-helper';
import { expect } from 'chai';

function createAddAction({ value }: { value: bigint }): SetupAction<{ contract: Adder }> {
    return {
        description: `add ${value}`,
        async execute(ctx) {
            await ctx.contract.add(value);
        },
    };
}

function createAddScenario({ value, only, setupActions = [] }: {
    only?: boolean;
    value: bigint;
    setupActions?: SetupAction<{ contract: Adder }>[],
}) {
    return {
        value,
        ...createEthereumScenario({
            only,
            description: `add ${value}${describeSetupActions(setupActions)}`,
            async setup(ctx) {
                ctx.addContext('value', value);
                const contract = await Adder.deploy();
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

const scenarios = generatorChain(function*() {
    for (const value of range(1n, 3n)) {
        yield { value };
    }
}).then(function*(properties) {
    for (const value of range(1n, 3n)) {
        yield {
            ...properties,
            setupActions: [ createAddAction({ value }) ],
        };
    }
}).then(function*(properties) {
    yield createAddScenario(properties);
});

describe('Adder', () => {
    for (const scenario of scenarios) {
        scenario.describe(({ it }) => {
            it('should add the provided value', async (test) => {
                const prev = await test.contract.value();
                await test.execute();
                expect(await test.contract.value())
                    .to.be.equal(prev + scenario.value);
            });
        });
    }
});
