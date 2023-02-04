type TestExecutionFunction<Context> = Context extends void ? () => void : (ctx: Context) => void;

interface TestDescriberFunction<Context> {
    (title: string, fn: TestExecutionFunction<Context>): void;
}

interface ItFunction<Context> extends TestDescriberFunction<Context> {
    only: TestDescriberFunction<Context>;
}

interface ContextProvider<Context> {
    (): Context;
}

function createTestDescriberFunction<Context>(it: TestDescriberFunction<void>, ctx: ContextProvider<Context>): TestDescriberFunction<Context> {
    return (title, fn) => it(title, () => fn(ctx()));
}

function createItFunction<Context>(ctx: ContextProvider<Context>): ItFunction<Context> {
    return Object.assign(createTestDescriberFunction(it, ctx), {
        only: createTestDescriberFunction(it.only, ctx)
    });
}

function getAddContext() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const addContext: typeof import('mochawesome/addContext') = require('mochawesome/addContext');
        return (ctx: Mocha.Context, title: string, value: unknown) => {
            if (typeof(value) == 'bigint') value = value.toString();
            addContext(ctx, { title, value });
        };
    } catch {
        return () => undefined;
    }
}

const addContext = getAddContext();

export interface TestSetupContext {
    addContext(title: string, value: unknown): void;
}

export interface TestScenarioProperties<TestContext> {
    only?: boolean;
    description: string;
    setup(ctx: TestSetupContext): TestContext | Promise<TestContext>;
    teardown?: () => void | Promise<void>;
}

export interface TestScenario<TestContext> {
    readonly description: string;

    describe(fn: {
        (ctx: {
            it: ItFunction<TestContext>;
        }): void;
    }): void;
}

export function createTestScenario<TestContext>(props: TestScenarioProperties<TestContext>): TestScenario<TestContext> {
    const { only, description, setup, teardown } = props;

    return {
        description,

        describe(fn) {
            (only ? describe.only : describe)(this.description, () => {
                let ctx: TestContext;

                beforeEach(async function() {
                    ctx = await setup({
                        addContext: (title, value) => {
                            addContext(this, title, value);
                        },
                    });
                });

                if (teardown) afterEach(teardown);

                fn({
                    it: createItFunction(() => ctx)
                });
            });
        }
    };
}
