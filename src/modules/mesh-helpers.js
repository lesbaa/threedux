import * as THREE from 'three'
import tsc from 'three-simplicial-complex'
import svgMesh3d from 'svg-mesh-3d'

const createGeometry = tsc(THREE)

const {
  Vector3,
  Vector2,
  Euler,
  BufferGeometry,
  Geometry,
  BufferAttribute,
  Mesh,
  DoubleSide,
  MeshBasicMaterial,
} = THREE

// TODO make this more generalised at some point
/**
 * eg given an array of attributes and transforms given each face etc
 * faces.map(applyFaceTransform({
 *   vertices,
 *   faces,
 * })) or something?
 * createCustomGeometryAttribute?
 */
export function calculateGeometryGlAttribs({ faces, vertices, }) {
  const {
    aCentroid,
    aDirection,
    aRandomiser,
    aNormal,
  } = faces.reduce((acc, { normal, a, b, c }, i) => {

    const vecA = vertices[a]
    const vecB = vertices[b]
    const vecC = vertices[c]
    
    const centerPoint = new Vector3(
      (vecA.x + vecB.x + vecC.x) / 3,
      (vecA.y + vecB.y + vecC.y) / 3,
      (vecA.z + vecB.z + vecC.z) / 3,
    )
    
    const centerPointAsArray = centerPoint.toArray()
    const normalsArray = normal.toArray()
    const rndm = (Math.random() * 10) + 1

    const randomRotation = new Euler(0, 0, 0, 'XYZ')

    const directionalVec = centerPoint
      .clone()
      .applyEuler(randomRotation)
      .normalize()
      .multiplyScalar(rndm)
      .toArray()

    acc.aNormal.push(
      ...normalsArray, ...normalsArray, ...normalsArray
    )

    acc.aCentroid.push(
      ...centerPointAsArray, ...centerPointAsArray, ...centerPointAsArray
    )

    acc.aDirection.push(
      ...directionalVec, ...directionalVec, ...directionalVec
    )

    acc.aRandomiser.push(
      rndm, rndm, rndm,
      rndm, rndm, rndm,
      rndm, rndm, rndm,
    )
    
    return acc
  }, {
    aCentroid:[],
    aDirection: [],
    aRandomiser: [],
    aNormal: [],
  });

  return {
    aCentroid: new Float32Array(aCentroid),
    aDirection: new Float32Array(aDirection),
    aRandomiser: new Float32Array(aRandomiser),
    aNormal: new Float32Array(aNormal),
  }
}

export function getGeometryFromSVGPathData(pathData) {
  const meshData = svgMesh3d(pathData)
  const svgGeometry = createGeometry(meshData)
  
  const bufferGeometry = toBufferGeometry(svgGeometry)
  
  return toGeometry(bufferGeometry)
}

export function getSVGPathDataFromMarkup(markup) {
  const d = document.createElement('div')
  d.innerHTML = markup

  const paths = Array.from(d.querySelectorAll('path'))

  return paths.map(p => p.getAttribute('d'))
    .join(' ')
}

export async function createMaterialedSVGMeshFromFile({
  url,
  material = new MeshBasicMaterial({
    color: 0xffffff,
    morphTargets: true,
  }),
  primers = [ mesh => mesh ],
}) {
  
  const svg = await loadTextFile(url)

  const geometry = getSVGGeometry({
    svg,
    bufferizeGeometry: material.isShaderMaterial,
  })

  const mesh = new Mesh(
    geometry,
    material,
  )

  mesh.material.side = DoubleSide

  return primers.reduce((mesh, primer) => {
    return primer(mesh)
  }, mesh)
}

export async function loadTextFile(url) {
  const file = await fetch(url)
  const svg = await file.text()
  return svg
}

export function getSVGGeometry({
  svg,
  bufferizeGeometry,
}) {
  const pathData = getSVGPathDataFromMarkup(svg)
  const svgGeometry = getGeometryFromSVGPathData(pathData)
  
  if (!bufferizeGeometry) return svgGeometry
  return bufferize(svgGeometry)
}

// TODO, see comment at the top of this file re generalising this function
export function bufferize(geometry) {
  const {
    aCentroid,
    aDirection,
    aRandomiser,
    aNormal,
  } = calculateGeometryGlAttribs(geometry)

  const bufferGeometry = toBufferGeometry(geometry)

  bufferGeometry.addAttribute('aCentroid', new BufferAttribute(aCentroid, 3))
  bufferGeometry.addAttribute('aDirection', new BufferAttribute(aDirection, 3))
  bufferGeometry.addAttribute('aRandomiser', new BufferAttribute(aRandomiser, 3))
  bufferGeometry.addAttribute('aNormal', new BufferAttribute(aNormal, 3))

  return bufferGeometry
}

export function toBufferGeometry(g) { return new BufferGeometry().fromGeometry(g) }
export function toGeometry(g) { return new Geometry().fromBufferGeometry(g) }

export function recalculateUVs(geometry) {
  geometry.computeBoundingBox()

  const max = geometry.boundingBox.max
  const min = geometry.boundingBox.min
  const offset = new Vector2(0 - min.x, 0 - min.y)
  const range = new Vector2(max.x - min.x, max.y - min.y)
  const faces = geometry.faces
  
  geometry.faceVertexUvs[0] = []
  
  for (let i = 0; i < faces.length; i++) {
      const v1 = geometry.vertices[faces[i].a]
      const v2 = geometry.vertices[faces[i].b]
      const v3 = geometry.vertices[faces[i].c]
  
      geometry.faceVertexUvs[0].push([
          new Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
          new Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
          new Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y),
      ])
  }
  geometry.uvsNeedUpdate = true

  return geometry
}