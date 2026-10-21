import type { FieldErrors, FieldPath, FieldValues } from 'react-hook-form'

export const getError = <T extends FieldValues>(
	errors: FieldErrors<T>,
	name: FieldPath<T>
): string | undefined => {
	const parts = String(name).split('.')
	let current: unknown = errors
	for (const part of parts) {
		if (current == null || typeof current !== 'object') return undefined
		current = (current as Record<string, unknown>)[part]
	}
	if (current && typeof current === 'object' && 'message' in current) {
		return String((current as { message?: unknown }).message)
	}
	return undefined
}
