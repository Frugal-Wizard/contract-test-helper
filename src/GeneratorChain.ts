export interface GeneratorFunction<IN, OUT> {
    (input: IN): Iterable<OUT>;
}

export class GeneratorChain<T> {
    private readonly generatorFunction: GeneratorFunction<void, T>;

    constructor(generatorFunction: GeneratorFunction<void, T>) {
        this.generatorFunction = generatorFunction;
    }

    then<T2>(generatorFunction: GeneratorFunction<T, T2>): GeneratorChain<T2> {
        const parentGeneratorFunction = this.generatorFunction;
        return new GeneratorChain(function*() {
            for (const parentItem of parentGeneratorFunction()) {
                for (const item of generatorFunction(parentItem)) {
                    yield item;
                }
            }
        });
    }

    *[Symbol.iterator]() {
        for (const item of this.generatorFunction()) {
            yield item;
        }
    }
}

export function generatorChain<T>(generatorFunction: GeneratorFunction<void, T>): GeneratorChain<T> {
    return new GeneratorChain(generatorFunction);
}
