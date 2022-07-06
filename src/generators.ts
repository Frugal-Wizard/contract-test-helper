export function range(min: number, max: number, step?: number): Iterable<number>;
export function range(min: bigint, max: bigint, step?: bigint): Iterable<bigint>;
export function* range(min: number | bigint, max: number | bigint, step?: number | bigint): Iterable<number | bigint> {
    for (let value = min; value <= max; step ? (value as number) += (step as number) : value++) {
        yield value;
    }
}

export function* repeat<T>(amount: number, value: T): Iterable<T> {
    for (let i = 0; i < amount; i++) {
        yield value;
    }
}

export function* permutations<T>(values: Iterable<T>): Iterable<T[]> {
    const valuesArray: T[] = Array.isArray(values) ? values : [ ...values ];
    yield [];
    for (const value of valuesArray) {
        for (const permutation of permutations(valuesArray.filter(v => v !== value))) {
            yield [ value, ...permutation ];
        }
    }
}

export function* combinations<T>(values: Iterable<T>): Iterable<T[]> {
    const valuesArray: T[] = Array.isArray(values) ? values : [ ...values ];
    yield [];
    for (const [ index, value ] of valuesArray.entries()) {
        for (const combination of combinations(valuesArray.slice(index + 1))) {
            yield [ value, ...combination ];
        }
    }
}

export function* repetitions<T>(values: Iterable<T>, minAmount: number, maxAmount = minAmount): Iterable<T[]> {
    if (!Array.isArray(values)) values = [ ...values ];
    if (maxAmount == 0) {
        yield [];
        return;
    }
    for (const prev of repetitions(values, minAmount < maxAmount ? minAmount : maxAmount, maxAmount - 1)) {
        if (minAmount < maxAmount) {
            yield prev;
        }
        if (prev.length == maxAmount - 1) {
            for (const value of values) {
                yield [ ...prev, value ];
            }
        }
    }
}
