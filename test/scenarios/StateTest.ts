import { generatorChain } from '../../src/GeneratorChain';
import { range } from '../../src/generators';
import { createStateTestAddAction, createStateTestSubtractAction } from '../action/StateTest';
import { createStateTestScenario } from '../scenario/StateTest';

export const stateTestScenarios = generatorChain(function*() {
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
                createStateTestAddAction({ value }),
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
                    createStateTestSubtractAction({ value }),
                ],
            };
        }
    }

}).then(function*(properties) {
    // filter out invalid setups
    try {
        const state = { value: 0n };
        properties.setupActions.forEach(action => action.apply(state));
        yield properties;

    } catch {
        // ignore
    }

}).then(function*(properties) {
    yield createStateTestScenario(properties);
});
