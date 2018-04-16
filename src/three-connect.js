import apply from '../src/modules/apply-state-to-obj3d'
import clone3DAttributes from './modules/clone-3d-attributes'
import withThreedom from './with-threedom'

const threeConnect = (
  store,
  applyFunc = apply,
) => (
  mapStateToObj3D,
  mapDispatchToObj3D,
) => (obj3d) => { 
  const clonedObject = withThreedom(obj3d.clone())
  
  store.subscribe(() => {
    const state = store.getState()
    const mappedState = mapStateToObj3D(state)
    clonedObject.setState(mappedState)
  })

  clonedObject.actions = mapDispatchToObj3D(store.dispatch)

  return clonedObject
}

export default threeConnect
