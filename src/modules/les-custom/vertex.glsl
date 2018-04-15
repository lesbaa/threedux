attribute vec3 aCentroid;
attribute vec3 aDirection;
attribute float aRandomiser;
uniform float uTime;
uniform float uExplodeAmount;
varying vec2 vUv;

#define PI 3.14

float random(vec2 c){
  return fract(sin(dot( c.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec3 rotateAroundCentroid(vec3 vVertex, vec3 vCentroid, mat3 mRotation) {
  // translate the vertex to 0, 0, 0
  vec3 vVertexAtOrigin = vVertex - vCentroid;
  // rotate with matrix
  vec3 vRotatedPoint = vVertexAtOrigin * mRotation;
  // return rotated point, moved back to original centroid
  return vRotatedPoint + vCentroid;
}

void main() {

  float theta = (uExplodeAmount * aRandomiser) * (PI * 1.5);
  mat3 rotMat = mat3(
    vec3(cos(theta), 0.0, sin(theta)),
    vec3(-sin(theta) * -sin(theta), cos(theta), -sin(theta) * cos(theta)),
    vec3(-sin(theta) * cos(theta), sin(theta), cos(theta) * cos(theta))
  );

  vec3 vRotated = rotateAroundCentroid(position, aCentroid, rotMat);

  vec3 tPos = vRotated + (aDirection * uExplodeAmount);

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(
    tPos.xyz,
    1.0
  );
}
