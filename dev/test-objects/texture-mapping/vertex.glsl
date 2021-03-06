uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 up = vec3(0,1.0,0);
  vNormal = normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(
    position.xyz,
    1.0
  );
}
