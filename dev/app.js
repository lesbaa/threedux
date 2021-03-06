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

import Stats from '../src/modules/stats'
import mesh, {
  increment,
  decrement,
} from './test-objects/mesh'

import {
  Style3D,
} from '../src/threedux/Style3D'

class App {
  constructor() {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
  }

  init = () => {
    this.scene = applyCubeMap(this.scene, './assets/cube-map.png')
    this.initStats()
    this.addLights()

    window.mesh = this.mesh = mesh
    this.camera.position.z = 2
    this.camera.lookAt(new Vector3(0,0,0))

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
      transition: {
        transitionEasingFunction: 'linear',
        position: { x: 2, y: 2, z: 2 },
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

  addLights = () => {
    this.light = new PointLight( 0xffffff, 1, 100 )
    this.light.position.set( 2, 2, 2 )
    const lightTwo = new PointLight( 0xffffff, 0.7, 100 )
    lightTwo.position.set( 2, -2, 2 )

    this.scene.add(this.light)
    this.scene.add(lightTwo)
  }

  loop = (t) => {
    this.mesh.tick(t)
    this.mesh.material.tick(t)
    // this.camera.position.x = Math.sin(t / 2000)
    // this.camera.position.y = Math.cos(t / 2000)
    // this.camera.lookAt(new Vector3(0,0,0))
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

