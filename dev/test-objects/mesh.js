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
} from '../../src/threedux/Style3D'
import { connect } from '../store'
import {
  incrementAction,
  decrementAction,
} from '../actions'
import withEvents from '../../src/modules/with-events'
import connectedMaterial from './palantir-material'
import {
  scene,
  renderer,
  camera,
} from '../../src/modules/set-up-three'

const geom = new CubeGeometry(0.5, 0.5, 0.5)
// geom.faces.forEach(face => {
//   const randomX = (Math.random() - 0.5) / 50.0
//   const randomY = (Math.random() - 0.5) / 50.0
//   const randomZ = (Math.random() - 0.5) / 50.0
//   geom.vertices[face.a].x += randomX
//   geom.vertices[face.a].y += randomX
//   geom.vertices[face.a].z += randomX
//   geom.vertices[face.b].x += randomY
//   geom.vertices[face.b].y += randomY
//   geom.vertices[face.b].z += randomY
//   geom.vertices[face.c].x += randomZ
//   geom.vertices[face.c].y += randomZ
//   geom.vertices[face.c].z += randomZ
// })

// geom.needsUpdate = true
// geom.computeVertexNormals()

const mesh = new Mesh(
  geom,
  connectedMaterial,
)

mesh.rotation.y = Math.PI / -2

// new MeshBasicMaterial({
//   map: new TextureLoader().load('./assets/cube-map.png'),
// })

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
        // 'position',
        'rotation',
        'scale',
      ],
      transitionEasingFunction: 'elasticOut',
      transitionDuration: 1000,
    },
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  })
)

function mapStateToObj3D ({
  value,
}, obj3d) {
  obj3d.setState({
    rotation: { x: value, y: value },
    scale: { x: value, y: value, z: value },
  })
}

function mapDispatchToObj3D (dispatch) {
  return bindActionCreators({
    incrementAction,
    decrementAction,
  }, dispatch)
}

export default enhancedMesh
