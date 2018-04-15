/**
 * clones the enumerable properties of an object to a new object
 * @param {Object} obj - The object to clone
 */

export default function cloneObject(obj) {
  if (typeof obj !== 'object') return obj
  return Object.entries(obj)
    .reduce((acc, [key, value]) => {
      acc[key] = cloneObject(value)
      return acc
    }, {})
}
