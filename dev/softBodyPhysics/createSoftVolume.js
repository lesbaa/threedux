import * as THREE from 'three'
import Ammo from 'ammonext'

import processGeometry from './processGeometry'
import {
  MARGIN,
} from './physicConstants'

const {
  Mesh,
} = THREE

const softBodyHelpers = new Ammo.btSoftBodyHelpers()

export default function createSoftVolume({
  geometry,
  material,
  mass,
  pressure,
  worldInfo,
}) {
  const processedGeometry = processGeometry(geometry)

  const volume = new Mesh(processedGeometry, material)
  volume.castShadow = true
  volume.receiveShadow = true
  volume.frustumCulled = false

  // Volume physic object
  const physicsVolume = softBodyHelpers.CreateFromTriMesh(
    worldInfo,
    processedGeometry.ammoVertices,
    processedGeometry.ammoIndices,
    processedGeometry.ammoIndices.length / 3,
    true
  )

  const sbConfig = physicsVolume.get_m_cfg()

  sbConfig.set_viterations( 40 )
  sbConfig.set_piterations( 40 )

  // Soft-soft and soft-rigid collisions
  sbConfig.set_collisions( 0x11 )

  // Friction
  sbConfig.set_kDF( 0.1 )

  // Damping
  sbConfig.set_kDP( 0.01 )

  // Pressure
  sbConfig.set_kPR( pressure )

  // Stiffness
  physicsVolume.get_m_materials().at( 0 ).set_m_kLST( 0.9 )
  physicsVolume.get_m_materials().at( 0 ).set_m_kAST( 0.9 )
  physicsVolume.setTotalMass( mass, false )

  Ammo.castObject( physicsVolume, Ammo.btCollisionObject ).getCollisionShape().setMargin( MARGIN )

  // TODO remember to call this outside of here.
  // world.addSoftBody( volumeSoftBody, 1, -1 )
  volume.userData.physicsBody = physicsVolume
  // Disable deactivation
  physicsVolume.setActivationState(4)

  return {
    volume,
    physicsVolume,
  }
}