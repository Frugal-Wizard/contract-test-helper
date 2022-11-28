import { generatorChain } from '../../src/GeneratorChain';
import { range } from '../../src/generators';
import { createDeployTestScenario } from '../scenario/DeployTest';

export const deployTestScenarios = generatorChain(function*() {
    for (const value of range(1n, 3n)) {
        yield {
            value,
        };
    }

}).then(function*(properties) {
    yield createDeployTestScenario(properties);
});
