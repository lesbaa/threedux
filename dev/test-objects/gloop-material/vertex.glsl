uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vReflectNormal;
varying vec3 vEye;

void main() {

  vEye = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
  vReflectNormal = normalize( normalMatrix * normal );
  vNormal = normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(
    position.xyz,
    1.0
  );
}
