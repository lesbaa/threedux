import * as THREE from 'three'
import createPhysicalBox from './createPhysicalBox'

const {
  Quaternion,
  Vector3,
  MeshPhongMaterial,
  TextureLoader,
  RepeatWrapping,
} = THREE


export default function createGround({
  position = new Vector3( 0, 0, 0 ),
  quaternion = new Quaternion( 0, 0, 0, 1 ),
  texture = new TextureLoader().load('/assets/cube-map.png'),
  material = new MeshPhongMaterial({ color: 0xFFFFFF }),
} = {}) {
  const {
    threeObject: ground,
    physicsBody,
  } = createPhysicalBox({ // TODO make this an object to pass
    sx: 40,
    sy: 1,
    sz: 40,
    mass: 0,
    position,
    quaternion,
    material,
  })

  ground.castShadow = true
  ground.receiveShadow = true

  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(40, 40)
  ground.material.map = texture
  ground.material.needsUpdate = true

  return {
    ground,
    groundBody: physicsBody,
  }
}