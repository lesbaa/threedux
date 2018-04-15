import {
  CubeGeometry,
  MeshStandardMaterial,
  CubeTextureLoader,
  LinearFilter,
  PointLight,
  Vector3,
  Mesh,
} from 'three'
import store from './store'
import setUpThree from '../src/modules/set-up-three.js'
import Stats from '../src/modules/stats'

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
    this.init()
  }

  init = () => {
    this.scene = applyCubeMap(this.scene, './assets/cube-map.png')
    this.initStats()
    this.addLights()
    this.mesh = new Mesh(
      new CubeGeometry(1,1,1),
      new MeshStandardMaterial({
        color: 0xffffff,
      })
    )
    this.scene.add(this.mesh)
    this.camera.position.z = 5
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
    this.mesh.rotation.x += 0.01
    this.mesh.rotation.y += 0.01
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