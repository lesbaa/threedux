import * as THREE from 'three'

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderTarget,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  ShaderMaterial,
  Vector2,
} = THREE

export function setupRTT({
  scene,
  renderer,
}) {
  const rttScene = new Scene()
  const rttCamera = new PerspectiveCamera(
    75, // frustrum
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near
    1000, // far
  )

  const rttTarget = new WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    }
  )

  rttScene.add(rttCamera)  

  function rttRender() {
    renderer.render(rttScene, rttCamera, rttTarget, true)
  }

  return {
    rttRender,
    rttScene,
    rttTarget,
    rttCamera,
  }
}

export function createRTTBasicObject({
  geometry = new SphereGeometry(1,32,32),
  bufferizeGeometry = false,
  wireframe = false,
  rttTarget: { texture } = {},  
}) {
  const material = new MeshBasicMaterial({
    color: 0x000000,
    map: texture,
  })

  return new Mesh(
    geometry,
    material,
  )
}

export function createRTTShaderMaterialFromShader({
  shader,
  textureUniformName = 'uSampler',
  resolutionUniformName = 'uResolution',
  rttTexture,
  res = {
    x: window.innerWidth,
    y: window.innerHeight,
  },
}) {
  return new ShaderMaterial({
    ...shader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      ...shader.uniforms,
      [textureUniformName]: { type: 't', value: rttTexture },
      [resolutionUniformName]: {
        value: new Vector2(res.x, res.y),
      }
    }
  })
}
