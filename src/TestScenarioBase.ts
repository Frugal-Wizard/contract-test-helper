export interface TestScenarioFunction<TestContext, ExecuteResult, ExecuteStaticResult> {
    (ctx: TestScenarioContext<TestContext, ExecuteResult, ExecuteStaticResult>): void;
}

export interface TestScenarioContext<TestContext, ExecuteResult, ExecuteStaticResult> {
    it: {
        (title: string, fn: (ctx: TestContext & TestFunctions<ExecuteResult, ExecuteStaticResult>) => void): void;
        only(title: string, fn: (ctx: TestContext & TestFunctions<ExecuteResult, ExecuteStaticResult>) => void): void;
    };
}

export interface TestFunctions<ExecuteResult, ExecuteStaticResult> {
    execute(): Promise<ExecuteResult>;
    executeStatic(): Promise<ExecuteStaticResult>;
}

export interface AddContextFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (title: string, value: any): void;
}

function getAddContext(): typeof import('mochawesome/addContext') | undefined {
    try {
        return require('mochawesome/addContext');
    } catch {
        return undefined;
    }
}

export abstract class TestScenarioBase<TestContext, ExecuteResult, ExecuteStaticResult> {
    abstract get only(): boolean;

    abstract get description(): string;

    toString() {
        return this.description;
    }

    abstract addContext(addContext: AddContextFunction): void;

    abstract setup(): TestContext | Promise<TestContext>;

    abstract afterSetup(ctx: TestContext): void | Promise<void>;

    abstract teardown(): void | Promise<void>;

    abstract execute(ctx: TestContext): Promise<ExecuteResult>;

    abstract executeStatic(ctx: TestContext): Promise<ExecuteStaticResult>;

    describe(fn: TestScenarioFunction<TestContext, ExecuteResult, ExecuteStaticResult>) {
        (scenario => {
            (scenario.only ? describe.only : describe)(scenario.description, () => {
                let ctx: TestContext;

                beforeEach(async function() {
                    const addContext = getAddContext();
                    if (addContext) scenario.addContext((title, value) => addContext(this, { title, value }));
                    ctx = await scenario.setup();
                    await scenario.afterSetup(ctx);
                });

                afterEach(() => scenario.teardown());

                fn({
                    it: Object.assign((title: string, fn: (ctx: TestContext & TestFunctions<ExecuteResult, ExecuteStaticResult>) => void) => it(title, () => fn({
                        ...ctx,
                        execute: () => scenario.execute(ctx),
                        executeStatic: () => scenario.executeStatic(ctx),
                    })), {
                        only: (title: string, fn: (ctx: TestContext & TestFunctions<ExecuteResult, ExecuteStaticResult>) => void) => it.only(title, () => fn({
                            ...ctx,
                            execute: () => scenario.execute(ctx),
                            executeStatic: () => scenario.executeStatic(ctx),
                        })),
                    }),
                });
            });
        })(this);
    }
}
