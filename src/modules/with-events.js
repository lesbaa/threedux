/* eslint-disable no-inner-declarations */
import {
  Vector2,
  Raycaster,
  EventDispatcher,
  Object3D,
  Mesh,
} from 'three'

Object.assign(Object3D.prototype, EventDispatcher.prototype)
Object.assign(Mesh.prototype, EventDispatcher.prototype)

const withEvents = ({
  canvas,
  camera,
  scene,
}) => obj => {
  const obj3D = obj.clone()
  if (!canvas.isEventful) {
    const vMousePos = new Vector2()
    const raycaster = new Raycaster()
    const state = {
      lastTarget: null,
    }
    canvas.addEventListener('click', handleCanvasClick)

    canvas.addEventListener('mousemove', handleCanvasMouseMove)

    canvas.makeUneventful = () => {
      canvas.removeEventListener('click', handleCanvasClick)
      canvas.removeEventListener('mousemove', handleCanvasMouseMove)
      delete canvas.isEventful
    }

    canvas.isEventful = true

    function handleCanvasMouseMove({
      clientX,
      clientY,
    }) {
      vMousePos.x = (clientX / window.innerWidth) * 2 - 1
      vMousePos.y = (clientY / window.innerHeight) * 2 - 1

      const target = getIntersectObject(vMousePos, camera)

      if (!target && !state.lastTarget) return

      if (state.lastTarget !== target) {
        const dispatchFrom = target || state.lastTarget
        const type = target
          ? 'mouseenter'
          : 'mouseleave'

        dispatchFrom.dispatchEvent({
          type,
          target: dispatchFrom,
        })
      }

      state.lastTarget = target
  
    }

    function handleCanvasClick({
      clientX,
      clientY,
    }) {
      vMousePos.x = (clientX / window.innerWidth) * 2 - 1
      vMousePos.y = (clientY / window.innerHeight) * 2 - 1
      const target = getIntersectObject(vMousePos, camera)

      if (target) {
        target.dispatchEvent({
          type: 'click',
          target,
        })
      }
    }

    function getIntersectObject(vec, cam) {
      raycaster.setFromCamera(vec, cam)
      const [ intersect ] = raycaster.intersectObjects(scene.children)
      return intersect && intersect.object
    }
  }

  return obj3D
}


export default withEvents
