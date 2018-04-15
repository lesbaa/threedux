import {
  CubeGeometry,
  MeshStandardMaterial,
  CubeTextureLoader,
  LinearFilter,
  PointLight,
  Vector3,
  Mesh,
} from 'three'
import store, { connect } from './store'
import setUpThree from '../src/modules/set-up-three.js'
import withEvents from '../src/modules/with-events'
import Stats from '../src/modules/stats'
import {
  bindActionCreators,
  compose,
} from 'redux'

const turnAction = () => ({
  type: 'TURN',
  payload: {
    fod: 1,
  },
})

class App {
  constructor() {
    const {
      renderer,
      camera,
      scene,
    } = setUpThree()
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
  }

  init = () => {
    const button = document.querySelector('button')
    button.addEventListener('click', this.handleButtonClick)
    this.scene = applyCubeMap(this.scene, './assets/cube-map.png')
    this.initStats()
    this.addLights()
    this.mesh = new Mesh(
      new CubeGeometry(1,1,1),
      new MeshStandardMaterial({
        color: 0xffffff,
      })
    )
    this.camera.position.z = 5
    this.loop(0)
    const connectToRedux = connect(
      mapStateToObj3D,
      mapDispatchToObj3D,
    )
  
    const enhance = compose(
      connectToRedux,
      withEvents({
        canvas: this.renderer.domElement,
        camera: this.camera,
        scene: this.scene,
      }),
    )

    this.mesh = enhance(this.mesh)
    this.mesh.addEventListener('click', ({ target }) => {
      target.actions.turnAction()
    })
    this.scene.add(this.mesh)
  }

  initStats = () => {
    this.stats = new Stats()

    document.body.appendChild(
      document.createElement('div').appendChild(this.stats.dom)
    )
  }

  handleButtonClick = () => {
    store.dispatch({ payload: 1, type:'TURN' })
  }

  addLights = () => {
    this.light = new PointLight( 0xffffff, 1, 100 )
    this.light.position.set( 2, 2, 2 )
    const lightTwo = new PointLight( 0xffffff, 0.7, 100 )
    lightTwo.position.set( 2, -2, 2 )

    this.scene.add(this.light)
    this.scene.add(lightTwo)
  }

  loop = (t) => {
    // this.mesh.rotation.x += 0.01
    // this.mesh.rotation.y += 0.01
    this.camera.position.x = Math.sin(t / 2000) * 5
    this.camera.position.z = Math.cos(t / 2000) * 5
    this.camera.position.y = Math.cos(t / 2000)
    this.camera.lookAt(new Vector3(0,0,0))
    this.renderer.render(this.scene, this.camera)
    this.stats.update()
    requestAnimationFrame(this.loop)
  }
}


const app = new App()
app.init()

function applyCubeMap(scene, cubeMapUrl) {
  const cubeTexture = new CubeTextureLoader().load(
    [
      cubeMapUrl,
      cubeMapUrl,
      cubeMapUrl,
      cubeMapUrl,
      cubeMapUrl,
      cubeMapUrl,
    ]
  )
  cubeTexture.minFilter = LinearFilter
  scene.background = cubeTexture

  return scene
}

function mapStateToObj3D ({
  rotation,
}) {
  return {
    rotation: {
      x: rotation,
      y: rotation,
      z: rotation,
    },
  }
}

function mapDispatchToObj3D (dispatch) {
  return bindActionCreators({
    turnAction,
  }, dispatch)
}

