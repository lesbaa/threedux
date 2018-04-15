import apply from '../src/modules/apply-state-to-obj3d'

const threeConnect = (
  store,
  applyFunc = apply,
) => (
  mapStateToObj3D,
  mapDispatchToObj3D,
) => (obj3d) => {
  const clonedObject = obj3d.clone()
  
  store.subscribe(() => {
    const state = store.getState()
    const mappedState = mapStateToObj3D(state)
    applyFunc({
      obj3d: clonedObject,
      state: mappedState,
    })
  })

  clonedObject.actions = mapDispatchToObj3D(store.dispatch)

  return clonedObject
}

export default threeConnect
