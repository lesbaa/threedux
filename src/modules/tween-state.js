export default function tweenState({
  properties,
  from,
  to,
  alpha,
}) {
  const newState = {}
  for (const prop in to) {
    if (prop === 'transition') continue
    if (properties && !properties.includes(prop)) continue
    const toHasPropHasLength = to[prop] && Object.keys(to[prop]).length
    const fromHasPropHasLength = from[prop] && Object.keys(from[prop]).length

    if (!toHasPropHasLength || !fromHasPropHasLength) continue
    newState[prop] = {}

    for (const dimension in to[prop]) {

      const targetValue = to[prop][dimension]
      const initialValue = from[prop][dimension] || 0
      const range = targetValue - initialValue
      const delta = range * alpha
      if (
        (prop === 'intensity' || prop === 'refractionRatio') &&
        (initialValue + delta) <= 0
      ) {
        newState[prop][dimension] = 0.00000001
        continue
      }
      newState[prop][dimension] = initialValue + delta
    }
  }
  return newState
}