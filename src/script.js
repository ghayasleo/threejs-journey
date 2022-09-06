import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particle = textureLoader.load("/textures/particles/2.png")

// /**
//  * Galaxy
//  */
const props = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1
}

let geometry = null,
  material = null,
  points = null;

const generateGalaxy = () => {

  // destroy old galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points)
  }

  // geometry
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(props.count * 3)
  for (let i = 0; i < props.count; i++) {
    const i3 = i * 3
    const radius = Math.random() * props.radius
    const spinAngle = radius * props.spin
    const branchAngle = (i % props.branches) / props.branches * Math.PI * 2

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  // material
  material = new THREE.PointsMaterial({
    size: props.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  // point
  points = new THREE.Points(geometry, material)
  scene.add(points)
}

generateGalaxy()

// debug setting
gui.add(props, "count", 10, 100000, 10).onFinishChange(generateGalaxy)
gui.add(props, "size", 0.01, 0.1, 0.01).onFinishChange(generateGalaxy)
gui.add(props, "radius", 0.001, 20, 0.01).onFinishChange(generateGalaxy)
gui.add(props, "branches", 3, 20, 1).onFinishChange(generateGalaxy)
gui.add(props, "spin", -5, 5, 0.01).onFinishChange(generateGalaxy)

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
camera.position.z = 3
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

const animation = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animation)
}

animation()