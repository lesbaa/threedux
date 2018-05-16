import isEqual from './isEqual'

export default function mapIndices( bufGeometry, indexedBufferGeom ) {
  // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry
  const vertices = bufGeometry.attributes.position.array;
  const idxVertices = indexedBufferGeom.attributes.position.array;
  const indices = indexedBufferGeom.index.array;
  const numIdxVertices = idxVertices.length / 3;
  const numVertices = vertices.length / 3;
  bufGeometry.ammoVertices = idxVertices;
  bufGeometry.ammoIndices = indices;
  bufGeometry.ammoIndexAssociation = [];
  for ( let i = 0; i < numIdxVertices; i++ ) {
    const association = [];
    bufGeometry.ammoIndexAssociation.push( association );
    const i3 = i * 3;
    for ( let j = 0; j < numVertices; j++ ) {
      let j3 = j * 3;
      if ( 
        isEqual(
          idxVertices[ i3 ],
          idxVertices[ i3 + 1 ],
          idxVertices[ i3 + 2 ],
          vertices[ j3 ],
          vertices[ j3 + 1 ],
          vertices[ j3 + 2 ]
        )
      ) {
        association.push( j3 );
      }
    }
  }
  return bufGeometry
}