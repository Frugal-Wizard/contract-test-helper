import { TestError } from './TestScenario';
import { TestSetupAction } from './TestSetupAction';
import { Constructor } from './types';

export type DescriberFunction = (obj: unknown) => string;

export interface DescriberObject {
    describe: DescriberFunction;
}

export type Describer = DescriberObject | DescriberFunction | string;

export function describeWith(describer: Describer, obj: unknown) {
    if (typeof describer == 'object') {
        return describer.describe(obj);
    } else if (typeof describer == 'function') {
        return describer(obj);
    } else {
        return describer;
    }
}

export class ConfigurableDescriber<Config> implements DescriberObject {
    constructor(private describerFunction?: (obj: unknown, config?: Config) => string | undefined, private config?: Config) {}

    describe(obj: unknown): string {
        if (this.describerFunction) {
            const description = this.describerFunction(obj, this.config);
            if (description) {
                return description;
            }
        }
        throw new FailedToDescribe();
    }

    addDescriber<T>(type: Constructor<T>, describe: (obj: T, config?: Config) => string) {
        const prevDescriberFunction = this.describerFunction;
        this.describerFunction = function(obj, config) {
            if (prevDescriberFunction) {
                const description = prevDescriberFunction(obj, config);
                if (description) {
                    return description;
                }
            }
            if (obj instanceof type) {
                return describe(obj, config);
            }
        };
        return this;
    }

    configure(config: Config) {
        this.config = config;
        return this;
    }

    clone() {
        return new ConfigurableDescriber<Config>(this.describerFunction, this.config);
    }
}

export class FailedToDescribe extends Error {
    constructor() {
        super();
        this.name = 'FailedToDescribe';
    }
}

export function describeError(error: TestError) {
    return typeof error == 'function' ? error.name : error;
}

export function describeSetupActions(setupActions: ReadonlyArray<TestSetupAction<unknown>>): string {
    return setupActions.length ? ` after ${setupActions.map(({ description }) => description).join(' and ')}` : '';
}
