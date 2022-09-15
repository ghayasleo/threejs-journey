import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from "./shaders/water/vertex.glsl"
import waterFragmentShader from "./shaders/water/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })

const debug = {
  surfaceColor: 0x9BD8FF,
  depthColor: 0x186691,
}

// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(5, 5, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uBigWaveSpeed: { value: 0.75 },
    uBigWaveElevation: { value: 0.2 },
    uBigWaveFrequency: { value: new THREE.Vector2(4, 1.5) },

    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveSpeed: { value: 0.2 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveIteration: { value: 5 },

    uSurfaceColor: { value: new THREE.Color(debug.surfaceColor) },
    uDepthColor: { value: new THREE.Color(debug.depthColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
  },
  side: THREE.DoubleSide,
  // wireframe: true
})

const waveBigFolder = gui.addFolder("Big Waves")
waveBigFolder.close()
waveBigFolder.add(waterMaterial.uniforms.uBigWaveElevation, "value", 0, 1, 0.001).name("Elevation")
waveBigFolder.add(waterMaterial.uniforms.uBigWaveFrequency.value, "x", 0, 10, 0.001).name("X Frequency")
waveBigFolder.add(waterMaterial.uniforms.uBigWaveFrequency.value, "y", 0, 10, 0.001).name("Z Frequency")
waveBigFolder.add(waterMaterial.uniforms.uBigWaveSpeed, "value", 0, 10, 0.001).name("Speed")

const waveSmallFolder = gui.addFolder("Small Waves")
waveSmallFolder.close()
waveSmallFolder.add(waterMaterial.uniforms.uSmallWaveElevation, "value", 0, 0.6, 0.0001).name("Elevation")
waveSmallFolder.add(waterMaterial.uniforms.uSmallWaveSpeed, "value", 0, 2, 0.0001).name("Speed")
waveSmallFolder.add(waterMaterial.uniforms.uSmallWaveFrequency, "value", 0, 10, 0.001).name("Frequency")
waveSmallFolder.add(waterMaterial.uniforms.uSmallWaveIteration, "value", 0, 10, 1).name("Iteration")

const colorFolder = gui.addFolder("Color")
colorFolder.close()
colorFolder.add(waterMaterial.uniforms.uColorOffset, "value", 0, 1, 0.001).name("Color Offset")
colorFolder.add(waterMaterial.uniforms.uColorMultiplier, "value", 0, 10, 0.001).name("Color Multiplier")
colorFolder.addColor(debug, "surfaceColor").name("Surface Color").onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debug.surfaceColor))
colorFolder.addColor(debug, "depthColor").name("Depth Color").onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debug.depthColor))

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsed = clock.getElapsedTime()

  waterMaterial.uniforms.uTime.value = elapsed;

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()