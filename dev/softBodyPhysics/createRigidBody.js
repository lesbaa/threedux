import Ammo from 'ammonext'

export default function createRigidBody({
  threeObject,
  physicsShape,
  mass,
  position,
  quaternion,
}) {
  threeObject.position.copy( position )
  threeObject.quaternion.copy( quaternion )

  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin( new Ammo.btVector3( position.x, position.y, position.z ) )
  transform.setRotation( new Ammo.btQuaternion( quaternion.x, quaternion.y, quaternion.z, quaternion.w ) )

  const motionState = new Ammo.btDefaultMotionState( transform )

  const localInertia = new Ammo.btVector3( 0, 0, 0 )
  physicsShape.calculateLocalInertia( mass, localInertia )

  const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia )
  const physicsBody = new Ammo.btRigidBody( rbInfo )

  threeObject.userData.physicsBody = physicsBody

  return {
    physicsBody,
    threeObject,
  }
}
