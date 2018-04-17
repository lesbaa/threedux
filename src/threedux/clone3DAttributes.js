/**
 * clone3DAttributes
 * @param {Object} obj 
 * returns a function that either deep clones a tween-state object to a new object or
 * creates a tween-state object from a three.js object
 */
export default function clone3DAttributes (attrs = [
  'position',
  'rotation',
  'scale',
  'color',
  'intensity',
  'morphTargetInfluences',
  'uniforms',
  'attributes',
  'refractionRatio',
  'reflectivity',
]) {
  return (obj) => {
    const newObj = {}
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i]
      if (attr === 'color' && (obj.color || (obj.material && obj.material.color))) {
        newObj.color = {}
        newObj.color.r = obj.isMesh ? obj.material.color.r : obj.color.r
        newObj.color.g = obj.isMesh ? obj.material.color.g : obj.color.g
        newObj.color.b = obj.isMesh ? obj.material.color.b : obj.color.b
        continue
      }
      const isDimenionlessAttribute = (
        attr === 'intensity' ||
        attr === 'refractionRatio' ||
        attr === 'reflectivity'
      )

      if (isDimenionlessAttribute && obj[attr]){
        newObj[attr] = {}
        newObj[attr].val =
          (obj.isPointLight || obj.isLight || obj.isMaterial)
            ? obj[attr]
            : obj[attr].val
        continue
      }

      if (attr === 'morphTargetInfluences' && obj.morphTargetInfluences) {
        newObj.morphTargetInfluences = [...obj.morphTargetInfluences]
        continue
      }

      if (attr === 'uniforms' && obj.uniforms){
        newObj.uniforms = {}
        for (const uniformName in obj.uniforms) {
          newObj.uniforms[uniformName] = obj.isShaderMaterial || (obj.material && obj.material.isShaderMaterial)
            ? obj.uniforms[uniformName].value
            : obj.uniforms[uniformName]
        }
        continue
      }
      
      if (obj[attr]) {
        newObj[attr] = {}
        newObj[attr].x = obj[attr].x
        newObj[attr].y = obj[attr].y
        newObj[attr].z = obj[attr].z
      }
    }
    return newObj
  } 
}