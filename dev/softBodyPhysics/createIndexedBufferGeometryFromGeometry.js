import * as THREE from 'three'

export default function createIndexedBufferGeometryFromGeometry( geometry ) {
  const numVertices = geometry.vertices.length
  const numFaces = geometry.faces.length
  const bufferGeom = new THREE.BufferGeometry()
  const vertices = new Float32Array( numVertices * 3 )
  const indices = new ( numFaces * 3 > 65535 ? Uint32Array : Uint16Array )( numFaces * 3 )

  for ( let i = 0; i < numVertices; i++ ) {
    const p = geometry.vertices[ i ]
    const i3 = i * 3
    vertices[ i3 ] = p.x
    vertices[ i3 + 1 ] = p.y
    vertices[ i3 + 2 ] = p.z
  }

  for ( var i = 0; i < numFaces; i++ ) {
    const f = geometry.faces[ i ]
    const i3 = i * 3
    indices[ i3 ] = f.a
    indices[ i3 + 1 ] = f.b
    indices[ i3 + 2 ] = f.c
  }

  bufferGeom.setIndex( new THREE.BufferAttribute( indices, 1 ) )
  bufferGeom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )

  return bufferGeom
}