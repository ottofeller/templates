type ObjectLike = Record<string, unknown>

const isObject = (o: unknown): o is ObjectLike => o != null && typeof o === 'object'

/**
 * Compares two objects and returns the difference.
 * - new and updated properties look similar
 *  (they are defined on the difference object with the final value);
 * - deleted properties are shown as null.
 */
export const diff = (initial: ObjectLike, updated: ObjectLike): ObjectLike => {
  if (initial === updated) {
    return {}
  }

  if (!isObject(initial) || !isObject(updated)) {
    return updated
  }

  const allKeys = Array.from(new Set(Object.keys(initial).concat(Object.keys(updated))))

  return allKeys.reduce((acc, key) => {
    if (!initial.hasOwnProperty(key)) {
      // new property
      acc[key] = updated[key]
      return acc
    }

    if (!updated.hasOwnProperty(key)) {
      // deleted property
      acc[key] = null
      return acc
    }

    let initialProp = initial[key]
    let updatedProp = updated[key]

    // In case of a render function we have no bounding context and thus can't call it.
    if (typeof initialProp === 'function' || typeof updatedProp === 'function') {
      return acc
    }

    if (initialProp === updatedProp) {
      // Unchanged
      return acc
    }

    if (!isObject(initialProp) || !isObject(updatedProp)) {
      // The value either was a primitive or updated to a primitive (or both)
      acc[key] = updatedProp
      return acc
    }

    // Objects - handle recursively
    const difference = diff(initialProp, updatedProp)

    if (Object.keys(difference).length > 0) {
      acc[key] = difference
    }

    return acc
  }, Object.create(null))
}
