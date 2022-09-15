import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from "./shaders/test/vertex.glsl"
import testFragmentShader from "./shaders/test/fragment.glsl"
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)

const debug = {
  random: Math.random()
};

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uRandom: { value: debug.random }
  }
})

console.log(material.uniforms.uRandom)

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.renderOrder = 'YXZ'
// mesh.rotation.set(1, 1, 0)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

window.scene = scene;

/**
 * Animate
 */
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // console.log(Math.sin(elapsedTime * 0.01))

  // Update controls
  controls.update();

  material.uniforms.uRandom.value = (Math.sin(elapsedTime * 0.1));

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()