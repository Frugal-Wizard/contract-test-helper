import { Describer, describeWith } from './describer';

export interface TestSetupActionProperties {
    readonly describer: Describer;
}

export abstract class TestSetupAction<TestContext> implements TestSetupAction<TestContext> {
    readonly describer: Describer;

    constructor({ describer }: TestSetupActionProperties) {
        this.describer = describer;
    }

    get description() {
        return describeWith(this.describer, this);
    }

    toString() {
        return this.description;
    }

    abstract execute(ctx: TestContext): Promise<void>;

    abstract apply<T>(state: T): T;
}

export function applySetupActions<T>(setupActions: ReadonlyArray<TestSetupAction<unknown>>, state: T): T {
    for (const setupAction of setupActions) {
        state = setupAction.apply(state);
    }
    return state;
}
