/**
 * 
 * @param {Object} setup object
 * three.js bindings for tween library
 * obj3d: a three.js object, supported object types so far are
 *  - Object3d
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

applyStateToObj3d({
  obj3d: myMesh,
  state,
})

 */
export default function applyStateToObj3d({
  obj3d,
  state,
}) {
  for (const prop in state) {
    if (prop === 'color' && obj3d.material) {
      for (const channel in obj3d.material.color) {
        obj3d.material.color[channel] = state.color[channel]
      }
      continue
    }

    const isDimenionlessAttribute = (
      prop === 'intensity' ||
      prop === 'refractionRatio' ||
      prop === 'reflectivity'
    )

    if (isDimenionlessAttribute && obj3d[prop]) {
      obj3d[prop] = state[prop].val
      continue
    }
    
    if (prop === 'uniforms' && state.uniforms) {
      for (const uniformName in state.uniforms) {
        obj3d.uniforms[uniformName].value = state.uniforms[uniformName]
      }
      continue
    }

    for (const dimension in state[prop]) {
      if (!obj3d[prop]) continue
      obj3d[prop][dimension] = state[prop][dimension]
    }
  }
}
