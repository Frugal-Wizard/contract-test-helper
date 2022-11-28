import { generatorChain } from '../../src/GeneratorChain';
import { range } from '../../src/generators';
import { createTransactionTestAddAction } from '../action/TransactionTest';
import { createTransactionTestScenario } from '../scenario/TransactionTest';

export const transactionTestScenarios = generatorChain(function*() {
    for (const value of range(1n, 3n)) {
        yield {
            value,
            setupActions: [],
        };
    }

}).then(function*(properties) {
    yield properties;

    for (const value of range(1n, 3n)) {
        yield {
            ...properties,
            setupActions: [
                ...properties.setupActions,
                createTransactionTestAddAction({ value }),
            ],
        };
    }

}).then(function*(properties) {
    yield properties;

    if (properties.setupActions.length > 0) {
        for (const value of range(1n, 3n)) {
            yield {
                ...properties,
                setupActions: [
                    ...properties.setupActions,
                    createTransactionTestAddAction({ value }),
                ],
            };
        }
    }

}).then(function*(properties) {
    yield createTransactionTestScenario(properties);
});
