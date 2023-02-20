# README

## What is this?

This is a collection of helper functions and classes to help test Solidity smart contracts using [mocha](https://github.com/mochajs/mocha).

## What functionality does it provide?

* An ethereum provider stored in memory implemented using [ganache](https://github.com/trufflesuite/ganache).
* A framework for building reusable test scenarios.
* A set of utilities to generate test scenarios.

## Should I use this?

Currently it's not to be considered stable.

Use at your own discretion and don't rely on its interface staying backward compatible.

## How do I use this?

```solidity
contract Adder {
    uint256 private _value;

    function add(uint256 value_) external {
        _value += value_;
    }

    function value() external view returns (uint256) {
        return _value;
    }
}
```

```typescript
import { Adder } from './Adder';
import { SetupAction, createEthereumScenario, describeSetupActions, executeSetupActions, generatorChain, range } from '@frugalwizard/contract-test-helper';
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
```
