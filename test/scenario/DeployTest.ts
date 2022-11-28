import { createEthereumScenario } from '../../src/ethereum-scenario';
import { DeployTest } from '../contracts-ts/DeployTest';

export function createDeployTestScenario({ value, only }: {
    only?: boolean;
    value: bigint;
}) {
    return {
        value,

        ...createEthereumScenario({
            only,

            description: `deploy with ${value}`,

            async setup(ctx) {
                ctx.addContext('value', value);
                return {
                    ...ctx,
                    execute: () => DeployTest.deploy(value),
                };
            },
        })
    };
}
