/**
 * 
 * @param {Object} setup object
 * three.js bindings for tween library
 * obj3D: a three.js object, supported object types so far are
 *  - Object3D
 *  - Material
 *  - ShaderMaterial,
 *  - Light
 *  - Camera
 * 
 * state: the state object passed from tween-state
 *
 * ** NOT ALL PROPERTIES OF THESE OBJECTS ARE CURRENTLY TRANSITIONABLE **
 * ** TODO refactor for more general usage **
 * 
 * example usage:
 * 

const alpha = easingFunction(transitionProgress)
const state = tweenState({
  alpha,
  from: this.tween.currentState,
  to: this.tween.targetState,
  debug: this.debug
})

applyStateToObj3D({
  obj3D: myMesh,
  state,
})

 */
export default function applyStateToObj3D({
  obj3D,
  state,
}) {
  for (const prop in state) {
    if (prop === 'color' && obj3D.material) {
      for (const channel in obj3D.material.color) {
        obj3D.material.color[channel] = state.color[channel]
      }
      continue
    }

    const isDimenionlessAttribute = (
      prop === 'intensity' ||
      prop === 'refractionRatio' ||
      prop === 'reflectivity'
    )

    if (isDimenionlessAttribute && obj3D[prop]) {
      obj3D[prop] = state[prop].val
      continue
    }
    
    if (prop === 'uniforms' && state.uniforms) {
      for (const uniformName in state.uniforms) {
        if (typeof obj3D.uniforms[uniformName].value !== 'number') continue
        obj3D.uniforms[uniformName].value = state.uniforms[uniformName]
      }
      continue
    }

    for (const dimension in state[prop]) {
      if (!obj3D[prop]) continue
      if (state[prop][dimension]) obj3D[prop][dimension] = state[prop][dimension]
    }
  }
}
