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
    event AddResult(uint sum);

    function add(uint num1, uint num2) external returns (uint sum) {
        sum = num1 + num2;
        emit AddResult(sum);
    }
}
```

```typescript
import { Adder, AddResult } from './Adder';
import { AddContextFunction, BaseTestContext, TestScenario, TestScenarioProperties, generatorChain, range } from '@frugal-wizard/contract-test-helper';
import { Transaction } from '@frugal-wizard/abi2ts-lib';

interface AdderTestContext extends BaseTestContext {
    readonly adder: Adder;
}

interface AdderTestScenarioProperties extends TestScenarioProperties {
    readonly num1: bigint;
    readonly num2: bigint;
}

class AdderTestScenario extends TestScenario<AdderTestContext, Transaction, bigint> {
    readonly num1: bigint;
    readonly num2: bigint;

    constructor({ num1, num2, ...rest }: AdderTestScenarioProperties) {
        super(rest);
        this.num1 = num1;
        this.num2 = num2;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('num1', this.num1.toString());
        addContext('num2', this.num2.toString());
        super.addContext(addContext);
    }

    async _setup(): Promise<AdderTestContext> {
        const ctx = await super._setup();
        const adder = await Adder.deploy();
        return { ...ctx, adder };
    }

    async setup() {
        return await this._setup();
    }

    async execute({ adder }: AdderTestContext) {
        return await adder.add(this.num1, this.num2);
    }

    async executeStatic({ adder }: AdderTestContext) {
        return await adder.callStatic.add(this.num1, this.num2);
    }
}

const scenarios: Iterable<AdderTestScenario> = generatorChain(function*() {
    for (const num1 of range(1n, 3n)) {
        yield { num1 };
    }

}).then(function*(properties) {
    for (const num2 of range(1n, 3n)) {
        yield { ...properties, num2 };
    }

}).then(function*(properties) {
    const { num1, num2 } = properties;
    const describer = `add ${num1} and ${num2}`;
    yield { ...properties, describer };

}).then(function*(properties) {
    yield new AdderTestScenario(properties);
});

describe('Adder', () => {
    for (const scenario of scenarios) {
        scenario.describe(({ it }) => {
            it('should emit an AddResult event', async (test) => {
                const { events } = await test.execute();
                expect(events).to.have.length(1);
                const [ event ] = events;
                expect(event).to.be.instanceOf(AddResult);
                expect((event as AddResult).sum)
                    .to.be.equal(scenario.num1 + scenario.num2);
            });

            it('should return sum', async (test) => {
                expect(await test.executeStatic());
                    .to.be.equal(scenario.num1 + scenario.num2);
            });
        });
    }
});
```
