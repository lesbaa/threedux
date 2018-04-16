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
import withTransition from '../src/modules/with-transition'
import {
  StyleClass
} from '../src/three-dom'
import withStateTransition from '../src/with-state-transition'


const incrementAction = () => ({
  type: 'INCREMENT',
})

const decrementAction = () => ({
  type: 'DECREMENT',
})

const withRotationTransition = withStateTransition({
  tickCallback: (o) => { o.rotation.x += 0.01 },
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

    const connectToRedux = connect(
      mapStateToObj3D,
      mapDispatchToObj3D,
      withRotationTransition,      
    )
  
    const makeEventful = withEvents({
      canvas: this.renderer.domElement,
      camera: this.camera,
      scene: this.scene,
    })

    const enhance = compose(
      connectToRedux,
      makeEventful,
    )
    
    const increment = new Mesh(
      new CubeGeometry(0.5,0.5,0.5),
      new MeshStandardMaterial({
        color: 0xff5555,
      })
    )

    increment.position.x = 1
    increment.position.y = -1

    const decrement = new Mesh(
      new CubeGeometry(0.5,0.5,0.5),
      new MeshStandardMaterial({
        color: 0x5555ff,
      })
    )

    decrement.position.x = -1
    decrement.position.y = -1

    increment.addEventListener('click', () => {
      this.mesh.actions.incrementAction()
    })

    decrement.addEventListener('click', () => {
      this.mesh.actions.decrementAction()
    })

    this.scene.add(increment)
    this.scene.add(decrement)

    this.mesh = enhance(this.mesh)

    this.scene.add(this.mesh)

    this.style = new StyleClass({
      color: {
        r: Math.random() * 3,
        g: Math.random() * 3,
        b: Math.random() * 3,
      },
      position: {
        x: Math.random() * 3,
        y: Math.random() * 3,
        z: Math.random() * 3,
      },
    })

    this.mesh.classList.add(
      new StyleClass({
        transition: {
          transitionProperties: [
            'color',
            'position',
          ],
          transitionEasingFunction: 'elasticOut',
          transitionDuration: 1000,
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
    window.m = this.mesh
    this.loop(0)    
  }

  initStats = () => {
    this.stats = new Stats()

    document.body.appendChild(
      document.createElement('div').appendChild(this.stats.dom)
    )
  }

  handleButtonClick = () => {
    this.mesh.classList.toggle(this.style)
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
    this.mesh.tick()
    // this.mesh.rotation.y += 0.01
    this.camera.position.x = Math.sin(t / 2000)
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
  value,
}) {
  return {
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

