export default function removeProperties({
  obj,
  props,
}) {
  const newObj = {}
  for (const key in obj) {
    if (props.includes(key)) continue
    newObj[key] = obj[key]
  }
  return newObj
}