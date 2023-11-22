// On va créer une fonction permettant de relevé une erreur de manière typeSafe
export function assert (value: unknown, message?: string): asserts value {
    if (!value) {
        throw new Error(message ?? 'Value is falsy');
    }
}