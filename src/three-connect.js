import apply from '../src/modules/apply-state-to-obj3d'
import clone3DAttributes from './modules/clone-3d-attributes'

import {
  StyleClassList,
  StyleClass,
} from './three-dom'


const clone3DAttrs = clone3DAttributes([
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
])

const threeConnect = (
  store,
  applyFunc = apply,
) => (
  mapStateToObj3D,
  mapDispatchToObj3D,
  transition,
) => (obj3d) => { 
  const clonedObject = transition
    ? transition(obj3d.clone())
    : obj3d.clone()
  
  store.subscribe(() => {
    const state = store.getState()
    const mappedState = mapStateToObj3D(state)
    if (!transition) {
      applyFunc({
        obj3d: clonedObject,
        state: mappedState,
      })
    }
    console.log('aye')

  })

  clonedObject.actions = mapDispatchToObj3D(store.dispatch)

  return clonedObject
}

export default threeConnect
