import util from 'util';

export function inspect(value: unknown, showHidden = false) {
    return util.inspect(value, { showHidden, depth: null });
}

export function now() {
    return BigInt(Date.now()) / 1000n;
}
