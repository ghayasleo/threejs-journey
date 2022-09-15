varying vec2 vUv;

uniform float uRandom;
varying float vRandom;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vRandom = uRandom;
    vUv = uv;
}