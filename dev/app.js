import {
  CubeGeometry,
  MeshStandardMaterial,
  CubeTextureLoader,
  LinearFilter,
  PointLight,
  Vector3,
  Mesh,
  SphereBufferGeometry,
  BoxBufferGeometry,
  Clock,
} from 'three'

import { 
  createGround,
  createIndexedBufferGeometryFromGeometry,
  createPhysicalBox,
  createSoftVolume,
  createWorld,
  isEqual,
  mapIndices,
  processGeometry,
  updatePhysics,
} from './softBodyPhysics'

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

const clock = new Clock()

class App {
  constructor() {
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
  }

  init = () => {
    this.initStats()
    this.addLights()
    this.worldCenter = new Vector3(0,0,0)
    this.camera.position.z = 5
    this.camera.position.y = 1
    this.camera.lookAt(this.worldCenter)

    this.initPhysics()

    this.loop(0)    
  }

  initPhysics = () => {
    
    // init world
    this.world = createWorld()
    this.softBodies = []
    this.rigidBodies = []
    
    // add ground
    const {
      ground,
      groundBody,
    } = createGround()

    console.log(ground)
    this.scene.add(ground)
    this.rigidBodies.push(ground)
    this.world.addRigidBody(groundBody)
    
    const geometry = new SphereBufferGeometry(1, 32, 32)
    geometry.translate( 0, 7, 0 )

    const {
      volume: sphereVolume,
      physicsVolume,
    } = createSoftVolume({
      geometry,
      material: new MeshStandardMaterial({ color: 0xff5500 }),
      mass: 15,
      pressure: 100,
      worldInfo: this.world.getWorldInfo(),
    })

    this.softBodies.push(sphereVolume)
    this.world.addSoftBody( physicsVolume, 1, -1 )
    this.scene.add(sphereVolume)
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
    this.light.position.set( 5, 5, 5 )
    const lightTwo = new PointLight( 0xffffff, 0.7, 100 )
    lightTwo.position.set( -5, 5, -5 )

    this.scene.add(this.light)
    this.scene.add(lightTwo)
  }

  loop = (t) => {
    // this.camera.position.x = Math.sin(t / 2500) * 4
    // this.camera.position.z = Math.cos(t / 2500) * 4
    // this.camera.lookAt(this.worldCenter)
    // this.camera.lookAt(this.worldCenter)
    const delta = clock.getDelta()
    requestAnimationFrame(this.loop)    
    if (t < 5000) return

    const softBodies = this.softBodies
    const rigidBodies = this.rigidBodies

    this.world.stepSimulation(delta, 10)
    // Update soft volumes
    for (let i = 0, il = softBodies.length; i < il; i++) {
      const volume = softBodies[i]

      for (let j = 0; j < volume.geometry.ammoIndexAssociation.length; j++) {
        const node = volume.userData.physicsBody.get_m_nodes().at(j)
        const nodePos = node.get_m_x()
        const x = nodePos.x()
        const y = nodePos.y()
        const z = nodePos.z()
        const nodeNormal = node.get_m_n()
        const nx = nodeNormal.x()
        const ny = nodeNormal.y()
        const nz = nodeNormal.z()
        const assocVertex = volume.geometry.ammoIndexAssociation[j]
        for (let k = 0, kl = assocVertex.length; k < kl; k++) {
          let indexVertex = assocVertex[k]
          volume.geometry.attributes.position.array[indexVertex] = x
          volume.geometry.attributes.normal.array[indexVertex] = nx
          indexVertex++
          volume.geometry.attributes.position.array[indexVertex] = y
          volume.geometry.attributes.normal.array[indexVertex] = ny
          indexVertex++
          volume.geometry.attributes.position.array[indexVertex] = z
          volume.geometry.attributes.normal.array[indexVertex] = nz
        }
      }
      volume.geometry.attributes.position.needsUpdate = true
      volume.geometry.attributes.normal.needsUpdate = true
    }

    this.renderer.render(this.scene, this.camera)
    this.stats.update()
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

