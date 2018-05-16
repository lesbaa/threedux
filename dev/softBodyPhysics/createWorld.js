import Ammo from 'ammonext'

export default function createWorld({
  gravity = new Ammo.btVector3( 0, -9.8, 0 ),
} = {}) {
  // Physics configuration
  const collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration()
  const dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration )
  const broadphase = new Ammo.btDbvtBroadphase()
  const solver = new Ammo.btSequentialImpulseConstraintSolver()
  const softBodySolver = new Ammo.btDefaultSoftBodySolver()
  
  const physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration,
    softBodySolver,
  )

  physicsWorld.setGravity( gravity )
  physicsWorld.getWorldInfo().set_m_gravity( gravity )

  return physicsWorld
}