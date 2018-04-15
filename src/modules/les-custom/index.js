import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    'uTime': { value: 0.0 },
    'uExplodeAmount': { value: 0.0 },
  },
  vertexShader,
  fragmentShader,
}