/**
 * Unwrap the input and assert the value using the specified asserter.
 *
 * The asserter should throw an error if the assertion fails,
 * and return the value (or a transformed value, for convenient) otherwise.
 *
 * @param input The input promise
 * @param asserter The assertion function.
 */
export async function asyncAssert<T, A extends (value: T) => unknown>(
	input: Promise<T>,
	asserter: A
): Promise<A extends (value: T) => infer R ? (R extends void ? T : ReturnType<A>) : void> {
	const r = await input
	return asserter(r) ?? (r as any)
}
