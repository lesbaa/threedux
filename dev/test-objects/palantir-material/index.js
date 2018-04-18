import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

const res = new THREE.Vector2(window.innerWidth, window.innerHeight)

export default {
  uniforms: {
    'uTime': { value: 0.0 },
    'uVary': { value: 0.0 },
    'uResolution': { value: res },
    'uSamplerBump': { type: 't', texture: null },
    'uSamplerColor': { type: 't', texture: null },
  },
  vertexShader,
  fragmentShader,
}