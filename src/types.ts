export type Constructor<T> = { new (...args: never[]): T };

export function is<T>(type: Constructor<T>): (obj: unknown) => obj is T {
    return function(obj: unknown): obj is T  {
        return obj instanceof type;
    }
}
