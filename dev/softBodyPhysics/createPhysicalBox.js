import * as THREE from 'three'
import Ammo from 'ammonext'

import {
  MARGIN,
} from './physicConstants'

import createRigidBody from './createRigidBody'

export default function createPhysicalBox({
  sx,
  sy,
  sz,
  mass,
  position,
  quaternion,
  material,
}) {
  const threeObject = new THREE.Mesh(
    new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ),
    material,
  )
  const physicsShape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) )
  physicsShape.setMargin( MARGIN )

  const {
    threeObject: obj,
    physicsBody,
  } = createRigidBody({
    threeObject,
    physicsShape,
    mass,
    position,
    quaternion,
  })
  
  return {
    threeObject: obj,
    physicsBody,
  }
}