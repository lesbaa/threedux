import {
  CubeGeometry,
  MeshStandardMaterial,
  Mesh,
} from 'three'
import {
  bindActionCreators,
  compose,
} from 'redux'
import {
  Style3D,
} from '../../src/StyleClassList'
import { connect } from '../store'
import {
  incrementAction,
  decrementAction,
} from '../actions'
import withEvents from '../../src/modules/with-events'
import {
  scene,
  renderer,
  camera,
} from '../../src/modules/set-up-three'
const mesh = new Mesh(
  new CubeGeometry(1,1,1),
  new MeshStandardMaterial({
    color: 0xffffff,
  })
)

export const increment = new Mesh(
  new CubeGeometry(0.5,0.5,0.5),
  new MeshStandardMaterial({
    color: 0xff5555,
  })
)

export const decrement = new Mesh(
  new CubeGeometry(0.5,0.5,0.5),
  new MeshStandardMaterial({
    color: 0x5555ff,
  })
)

const connectToRedux = connect(
  mapStateToObj3D,
  mapDispatchToObj3D,   
)

const makeEventful = withEvents({
  canvas: renderer.domElement,
  camera: camera,
  scene: scene,
})

const enhance = compose(
  connectToRedux,
  makeEventful,
)

const enhancedMesh = enhance(mesh)

enhancedMesh.classList.add(
  new Style3D({
    transition: {
      transitionProperties: [
        'color',
        'position',
        'rotation',
        'scale',
      ],
      transitionEasingFunction: 'elasticOut',
      transitionDuration: 3000,
    },
    color: {
      r: 1.0,
      g: 0.0,
      b: 1.0,
    },
    position: {
      x: 0,
      y: 1,
      z: 0,
    },
  })
)

function mapStateToObj3D ({
  value,
}) {
  return {
    rotation: {
      x: value,
      y: value,
      z: value,
    },
    scale: {
      x: value,
      y: value,
      z: value,
    },
  }
}

function mapDispatchToObj3D (dispatch) {
  return bindActionCreators({
    incrementAction,
    decrementAction,
  }, dispatch)
}

export default enhancedMesh