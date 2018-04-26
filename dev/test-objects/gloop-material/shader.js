import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

const res = new THREE.Vector2(window.innerWidth, window.innerHeight)

export default {
  uniforms: {
    'uTime': { value: 0.0 },
    'uVary': { value: 0.0 },
    'uResolution': { value: res },
    'uPointOne' : { value: new THREE.Vector2(0.2, 0.3) },
    'uPointTwo' : { value: new THREE.Vector2(0.8, 0.4) },
    'uPointThree' : { value: new THREE.Vector2(0.2, 0.6) },
    'uPointFour' : { value: new THREE.Vector2(0.1, 0.8) },
  },
  vertexShader,
  fragmentShader,
}