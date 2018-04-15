import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    'tDiffuse': { value: null },
    'tileSize': { value: 0.1 },
    // 'mousePos': { value: new THREE.Vector2(0.0, 0.0) },
    'viewportSize': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader,
  fragmentShader,
}
