import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

const res = new THREE.Vector2(window.innerWidth, window.innerHeight)

export default {
  uniforms: {
    'uTime': { value: 0.0 },
    'uVary': { value: 0.0 },
    'uResolution': { value: res },
    'uPointOne' : { value: new THREE.Vector2(.47, .47) },
    'uPointTwo' : { value: new THREE.Vector2(.53, .53) },
    'uPointThree' : { value: new THREE.Vector2(.47, .53) },
    'uPointFour' : { value: new THREE.Vector2(.53, .47) },
  },
  vertexShader,
  fragmentShader,
}