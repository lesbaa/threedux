import {
  Vector3,
  Euler,
  DoubleSide,
  Object3D,
  Material,
  Geometry,
} from 'three'

export {
  withBloatMorph,
  withDisassambleMorph,
  withExplodeMorph,
}

// TODO bufferize / unbufferize if a primitive
/**
 * usage:
 * 
 
withSmallExplosion = withExplodeMorph({
  amount: 0.1
})

withLargeBloat = withBloatMorph({
  amount: 0.9
})

const modelWithExlposion = withSmallExplosion(obj3d)

const withAllTheMorphs = compose(
  withSmallExplosion,
  withLargeBloat,
)

const modelWithAllTheMorphs = withAllTheMorphs(obj3d)

 * 
 */

function withBloatMorph({
  amount = 1
} = {}) {
  return (obj3d) => {  
    if (!obj3d.geometry) {
      console.info('withBloatMorph: No geometry property found, returning plain object')
      return obj3d
    }
    const newObj = obj3d.clone()

    newObj.material.side = DoubleSide    

    const morphTargets = newObj.geometry.vertices.reduce((acc, { x, y, z }) => {
      const positionVec = new Vector3(
        x,
        y,
        z
      )
      
      const directionalVec = positionVec
        .clone()
        .multiplyScalar(amount)
        .normalize()
    
      positionVec
        .add(directionalVec)
    
      acc.push(positionVec)
    
      return acc
    }, [])

    newObj.geometry.morphTargets.push({ name: `bloat_${~~(Math.random() * 10e5)}`, vertices: morphTargets })
    
    newObj.updateMorphTargets()

    return newObj
  }
}

function withDisassambleMorph({
  amount = 0.5,
  disperseRandomly = true,
} = {}) {
  return (obj3d) => {
    if (!obj3d.geometry) {
      console.info('withDisassambleMorph: No geometry property found, returning plain object')
      return obj3d
    }
    const newObj = obj3d.clone()

    newObj.material.side = DoubleSide    
    
    const morphTargets = newObj.geometry.faces.reduce((acc, { normal, a, b, c }) => {
      
      const rndm = Math.random() * 10
      
      const randomRotation = disperseRandomly
      ? new Euler(rndm, rndm, rndm, 'XYZ')
      : new Euler(0, 0, 0, 'XYZ')
      
      const directionalVec = normal
      .clone()
      .applyEuler(randomRotation)
      .multiplyScalar(amount)
      
      const vertexIndices = [a, b, c]
      
      vertexIndices.forEach(vertexIndex => {
        acc[vertexIndex] = obj3d.geometry.vertices[vertexIndex]
          .clone()
          .add(directionalVec)
      });

      return acc
    }, [])
    
    newObj.geometry.morphTargets.push({ name: `disassemble_${~~(Math.random() * 10e5)}`, vertices: morphTargets })
    
    newObj.updateMorphTargets()
    
    return newObj
  }
}

function withExplodeMorph({
  amount = 3,
  disperseRandomly = true,
} = {}) {
  return (obj3d) => {
    if (!obj3d.geometry) {
      console.info('withExplodeMorph: No geometry property found, returning plain object')
      return obj3d
    }
    const newObj = obj3d.clone()

    newObj.material.side = DoubleSide

    const morphTargets = newObj.geometry.faces.reduce((acc, { normal, a, b, c }, i) => {
      const rndm = Math.random() * 10

      const randomRotation = disperseRandomly
        ? new Euler(rndm, rndm, rndm, 'XYZ')
        : new Euler(0, 0, 0, 'XYZ')

      normal
        .applyEuler(randomRotation)

        newObj.geometry.faces[i].normal = normal

      const directionalVec = normal
        .clone()
        .applyEuler(randomRotation)
      
      const vecA = newObj.geometry.vertices[a]
      const vecB = newObj.geometry.vertices[b]
      const vecC = newObj.geometry.vertices[c]

      const centerPoint = new Vector3(
        (vecA.x + vecB.x + vecC.x) / 3,
        (vecA.y + vecB.y + vecC.y) / 3,
        (vecA.z + vecB.z + vecC.z) / 3,
      ).normalize()

      const rotationAngle = 360 * (Math.PI / 180)

      const vertexIndices = [a, b, c]

      vertexIndices.forEach(vertexIndex => {
        acc[vertexIndex] = centerPoint
          .clone()
          .applyAxisAngle( centerPoint, rotationAngle )
          .add(directionalVec)
          .multiplyScalar(amount)
          
      })
    
      return acc
    }, [])

    newObj.geometry.morphTargets.push({ name: `explode_${~~(Math.random() * 10e5)}`, vertices: morphTargets })

    newObj.updateMorphTargets()

    return newObj
  }
}
