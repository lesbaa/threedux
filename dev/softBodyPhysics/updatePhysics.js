import Ammo from 'ammonext'

const transformAux1 = new Ammo.btTransform()

export default function updatePhysics(
  deltaTime,
  world,
  softBodies,
  rigidBodies
) {
  // Step world
  world.stepSimulation(deltaTime, 10)
  // Update soft volumes
  for (let i = 0, il = softBodies.length; i < il; i++) {
    const volume = softBodies[i]
    const geometry = volume.geometry
    const softBody = volume.userData.physicsBody
    const volumePositions = geometry.attributes.position.array
    const volumeNormals = geometry.attributes.normal.array
    const association = geometry.ammoIndexAssociation
    const numVerts = association.length
    const nodes = softBody.get_m_nodes()
    for (let j = 0; j < numVerts; j++) {
      const node = nodes.at(j)
      const nodePos = node.get_m_x()
      const x = nodePos.x()
      const y = nodePos.y()
      const z = nodePos.z()
      const nodeNormal = node.get_m_n()
      const nx = nodeNormal.x()
      const ny = nodeNormal.y()
      const nz = nodeNormal.z()
      const assocVertex = association[j]
      for (let k = 0, kl = assocVertex.length; k < kl; k++) {
        let indexVertex = assocVertex[k]
        volumePositions[indexVertex] = x
        volumeNormals[indexVertex] = nx
        indexVertex++
        volumePositions[indexVertex] = y
        volumeNormals[indexVertex] = ny
        indexVertex++
        volumePositions[indexVertex] = z
        volumeNormals[indexVertex] = nz
      }
    }
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.normal.needsUpdate = true
  }
  // Update rigid bodies
  for (let i = 0, il = rigidBodies.length; i < il; i++) {
    const objThree = rigidBodies[i]
    const objPhys = objThree.userData.physicsBody
    const ms = objPhys.getMotionState()
    if (ms) {
      ms.getWorldTransform(transformAux1)
      var p = transformAux1.getOrigin()
      var q = transformAux1.getRotation()
      objThree.position.set(p.x(), p.y(), p.z())
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
    }
  }
}