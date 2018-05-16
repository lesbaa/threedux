import * as THREE from 'three'
import createIndexedBufferGeometryFromGeometry from './createIndexedBufferGeometryFromGeometry'
import mapIndices from './mapIndices'

export default function processGeometry( bufGeometry ) {
  // Obtain a Geometry
  const geometry = new THREE.Geometry().fromBufferGeometry( bufGeometry )
  
  // Merge the vertices so the triangle soup is converted to indexed triangles
  const vertsDiff = geometry.mergeVertices()
  
  // Convert again to BufferGeometry, indexed
  const indexedBufferGeom = createIndexedBufferGeometryFromGeometry( geometry )
  
  // Create index arrays mapping the indexed vertices to bufGeometry vertices
  return mapIndices( bufGeometry, indexedBufferGeom )
}
