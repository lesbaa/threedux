import * as THREE from 'three'
import Ammo from 'ammonext'
import { MARGIN } from './physicConstants'

export default function createSoftBox({
  sizeX,
  sizeY,
  sizeZ,
  numPointsX,
  numPointsY,
  numPointsZ,
  tX,
  tY,
  tZ,
  mass,
  pressure,
  worldInfo,
}) {
  if ( numPointsX < 2 || numPointsY < 2 || numPointsZ < 2 ) {
      return;
  }
  // Offset is the numbers assigned to 8 vertices of the cube in ascending Z, Y, X in this order.
  // indexFromOffset is the vertex index increase for a given offset.
  var indexFromOffset = [];
  for ( var offset = 0; offset < 8; offset++ ) {
      var a = offset & 1 ? 1 : 0;
      var b = offset & 2 ? 1 : 0;
      var c = offset & 4 ? 1 : 0;
      var index = a + b * numPointsX + c * numPointsX * numPointsY;
      indexFromOffset[ offset ] = index;
  }
  // Construct BufferGeometry
  var numVertices = numPointsX * numPointsY * numPointsZ;
  var numFaces = 4 * ( ( numPointsX - 1 ) * ( numPointsY - 1 ) + ( numPointsX - 1 ) * ( numPointsZ - 1 ) + ( numPointsY - 1 ) * ( numPointsZ - 1 ) );
  var bufferGeom = new THREE.BufferGeometry();
  var vertices = new Float32Array( numVertices * 3 );
  var normals = new Float32Array( numVertices * 3 );
  var indices = new ( numFaces * 3 > 65535 ? Uint32Array : Uint16Array )( numFaces * 3 );
  // Create vertices and faces
  var sx = sizeX / ( numPointsX - 1 );
  var sy = sizeY / ( numPointsY - 1 );
  var sz = sizeZ / ( numPointsZ - 1 );
  var numFacesAdded = 0;
  for ( var p = 0, k = 0; k < numPointsZ; k++ ) {
      for ( var j = 0; j < numPointsY; j++ ) {
          for ( var i = 0; i < numPointsX; i++ ) {
              // Vertex and normal
              var p3 = p * 3;
              vertices[ p3 ] = i * sx - sizeX * 0.5;
              normals[ p3++ ] = 0;
              vertices[ p3 ] = j * sy - sizeY * 0.5;
              normals[ p3++ ] = 0;
              vertices[ p3 ] = k * sz - sizeZ * 0.5;
              normals[ p3 ] = 0;
              // XY faces
              if ( k === 0 && i < numPointsX - 1 && j < numPointsY - 1 ) {
                  let faceIndex = numFacesAdded * 3;
                  indices[ faceIndex++ ] = p + indexFromOffset[ 0 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 3 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 1 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 0 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 2 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 3 ];
                  numFacesAdded += 2;
              }
              if ( k === numPointsZ - 2 && i < numPointsX - 1 && j < numPointsY - 1 ) {
                  let faceIndex = numFacesAdded * 3;
                  indices[ faceIndex++ ] = p + indexFromOffset[ 7 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 6 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 5 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 5 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 6 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 4 ];
                  numFacesAdded += 2;
              }
              // XZ faces
              if ( j === 0 && i < numPointsX - 1 && k < numPointsZ - 1 ) {
                  let faceIndex = numFacesAdded * 3;
                  indices[ faceIndex++ ] = p + indexFromOffset[ 0 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 5 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 4 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 0 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 1 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 5 ];
                  numFacesAdded += 2;
              }
              if ( j === numPointsY - 2 && i < numPointsX - 1 && k < numPointsZ - 1 ) {
                  let faceIndex = numFacesAdded * 3;
                  indices[ faceIndex++ ] = p + indexFromOffset[ 3 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 2 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 6 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 3 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 6 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 7 ];
                  numFacesAdded += 2;
              }
              // YZ faces
              if ( i === 0 && j < numPointsY - 1 && k < numPointsZ - 1 ) {
                  var faceIndex = numFacesAdded * 3;
                  indices[ faceIndex++ ] = p + indexFromOffset[ 0 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 6 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 2 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 0 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 4 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 6 ];
                  numFacesAdded += 2;
              }
              if ( i === numPointsX - 2 && j < numPointsY - 1 && k < numPointsZ - 1 ) {
                  let faceIndex = numFacesAdded * 3;
                  indices[ faceIndex++ ] = p + indexFromOffset[ 1 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 3 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 5 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 3 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 7 ];
                  indices[ faceIndex++ ] = p + indexFromOffset[ 5 ];
                  numFacesAdded += 2;
              }
              p++;
          }
      }
  }
  bufferGeom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  bufferGeom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  bufferGeom.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
  bufferGeom.translate( tX, tY, tZ );
  // Create mesh from geometry
  var volume = new THREE.Mesh( bufferGeom, new THREE.MeshPhongMaterial( { color: 0xFFFFFF, wireframe: true } ) );
  volume.castShadow = true;
  volume.receiveShadow = true;
  volume.frustumCulled = false;

  // Create soft body
  var vectorTemp = new Ammo.btVector3( 0, 0, 0 );
  vectorTemp.setValue( vertices[ 0 ], vertices[ 1 ], vertices[ 2 ] );
  var physicsVolume = new Ammo.btSoftBody( worldInfo, 1, vectorTemp, [ 1.0 ] );
  var physMat0 = physicsVolume.get_m_materials().at( 0 );
  for ( let i = 1, il = vertices.length / 3; i < il; i++ ) {
      var i3 = i * 3;
      vectorTemp.setValue( vertices[ i3 ], vertices[ i3 + 1 ], vertices[ i3 + 2 ] );
      physicsVolume.appendNode( vectorTemp, 1.0 );
  }
  for ( let i = 0, il = indices.length / 3; i < il; i++ ) {
      let i3 = i * 3;
      physicsVolume.appendFace( indices[ i3 ], indices[ i3 + 1 ], indices[ i3 + 2 ] );
  }
  // Create tetrahedrons
  p = 0;
  function newTetra( i0, i1, i2, i3, i4 ) {
      var v0 = p + indexFromOffset[ i0 ];
      var v1 = p + indexFromOffset[ i1 ];
      var v2 = p + indexFromOffset[ i2 ];
      var v3 = p + indexFromOffset[ i3 ];
      var v4 = p + indexFromOffset[ i4 ];
      physicsVolume.appendTetra( v0, v1, v2, v3, v4 );
      physicsVolume.appendLink( v0, v1, physMat0, true );
      physicsVolume.appendLink( v0, v2, physMat0, true );
      physicsVolume.appendLink( v0, v3, physMat0, true );
      physicsVolume.appendLink( v1, v2, physMat0, true );
      physicsVolume.appendLink( v2, v3, physMat0, true );
      physicsVolume.appendLink( v3, v1, physMat0, true );
  }
  for ( let k = 0; k < numPointsZ; k++ ) {
      for ( let j = 0; j < numPointsY; j++ ) {
          for ( let i = 0; i < numPointsX; i++ ) {
              if ( i < numPointsX - 1 && j < numPointsY - 1 && k < numPointsZ - 1 ) {
                  // Creates 5 tetrahedrons for each cube
                  newTetra( 0, 4, 5, 6 );
                  newTetra( 0, 2, 3, 6 );
                  newTetra( 0, 1, 3, 5 );
                  newTetra( 3, 5, 6, 7 );
                  newTetra( 0, 3, 5, 6 );
                  /*
                  physicsVolume.appendTetra( p + indexFromOffset[ 0 ], p + indexFromOffset[ 4 ], p + indexFromOffset[ 5 ], p + indexFromOffset[ 6 ] );
                  physicsVolume.appendTetra( p + indexFromOffset[ 0 ], p + indexFromOffset[ 2 ], p + indexFromOffset[ 3 ], p + indexFromOffset[ 6 ] );
                  physicsVolume.appendTetra( p + indexFromOffset[ 0 ], p + indexFromOffset[ 1 ], p + indexFromOffset[ 3 ], p + indexFromOffset[ 5 ] );
                  physicsVolume.appendTetra( p + indexFromOffset[ 3 ], p + indexFromOffset[ 5 ], p + indexFromOffset[ 6 ], p + indexFromOffset[ 7 ] );
                  physicsVolume.appendTetra( p + indexFromOffset[ 0 ], p + indexFromOffset[ 3 ], p + indexFromOffset[ 5 ], p + indexFromOffset[ 6 ] );
                  */
              }
              p++;
          }
      }
  }
  // Config soft body
  var sbConfig = physicsVolume.get_m_cfg();
  sbConfig.set_viterations( 40 );
  sbConfig.set_piterations( 40 );
  // Soft-soft and soft-rigid collisions
  sbConfig.set_collisions( 0x11 );
  // Friction
  sbConfig.set_kDF( 0.1 );
  // Damping
  sbConfig.set_kDP( 0.01 );
  // Pressure
  sbConfig.set_kPR( pressure );
  // Stiffness
  var stiffness = 0.05;
  physMat0.set_m_kLST( stiffness );
  physMat0.set_m_kAST( stiffness );
  physMat0.set_m_kVST( stiffness );
  physicsVolume.setTotalMass( mass, false )
  Ammo.castObject( physicsVolume, Ammo.btCollisionObject ).getCollisionShape().setMargin( MARGIN );
  // TODO remember to call this outside of here
  // physicsWorld.addSoftBody( physicsVolume, 1, -1 );
  volume.userData.physicsBody = physicsVolume;
  // Disable deactivation
  physicsVolume.setActivationState( 4 );
  return {
    volume,
    physicsVolume,
  }
}

// render code
// for ( var i = 0, il = softBodies.length; i < il; i++ ) {
//   var volume = softBodies[ i ];
//   var geometry = volume.geometry;
//   var softBody = volume.userData.physicsBody;
//   var volumePositions = geometry.attributes.position.array;
//   var volumeNormals = geometry.attributes.normal.array;
//   var numVerts = volumePositions.length / 3;
//   var nodes = softBody.get_m_nodes();
//   var p = 0;
//   for ( var j = 0; j < numVerts; j ++ ) {
//       var node = nodes.at( j );
//       var nodePos = node.get_m_x();
//       var nodeNormal = node.get_m_n();
//       volumePositions[ p ] = nodePos.x();
//       volumeNormals[ p++ ] = nodeNormal.x();
//       volumePositions[ p ] = nodePos.y();
//       volumeNormals[ p++ ] = nodeNormal.y();
//       volumePositions[ p ] = nodePos.z();
//       volumeNormals[ p++ ] = nodeNormal.z();
//   }
//   geometry.attributes.position.needsUpdate = true;
//   geometry.attributes.normal.needsUpdate = true;