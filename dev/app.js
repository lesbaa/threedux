import {
  CubeGeometry,
  MeshStandardMaterial,
  CubeTextureLoader,
  LinearFilter,
  PointLight,
  Vector3,
  Mesh,
} from 'three'

import {
  scene,
  renderer,
  camera,
} from '../src/modules/set-up-three.js'
import withEvents from '../src/modules/with-events'
import Stats from '../src/modules/stats'
import mesh, {
  increment,
  decrement,
} from './test-objects/mesh'

import {
  Style3D,
} from '../src/StyleClassList'

class App {
  constructor() {
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

    this.mesh = mesh

    this.camera.position.z = 5

    increment.position.x = 1
    increment.position.y = -1

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
    this.scene.add(this.mesh)

    this.style = new Style3D({
      color: {
        r: 1.0,
        g: 1.0,
        b: 1.0,
      },
      transition: {
        transitionEasingFunction: 'linear',
      },
    })

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

