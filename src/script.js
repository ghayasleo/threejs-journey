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
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: "#FF6030",
  outsideColor: "#1B3984"
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
  const positions = new Float32Array(props.count * 3),
    colors = new Float32Array(props.count * 3),
    colorInside = new THREE.Color(props.insideColor),
    colorOutside = new THREE.Color(props.outsideColor)

  for (let i = 0; i < props.count; i++) {
    const i3 = i * 3,
      radius = Math.random() * props.radius,
      spinAngle = radius * props.spin,
      branchAngle = (i % props.branches) / props.branches * Math.PI * 2,
      randomX = Math.pow(Math.random(), props.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * props.randomness * radius,
      randomY = Math.pow(Math.random(), props.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * props.randomness * radius,
      randomZ = Math.pow(Math.random(), props.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * props.randomness * radius,
      mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / props.radius)

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  // material
  material = new THREE.PointsMaterial({
    size: props.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  // point
  points = new THREE.Points(geometry, material)
  scene.add(points)
}

generateGalaxy()

// debug setting
gui.add(props, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(props, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(props, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(props, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(props, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(props, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(props, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(props, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(props, 'outsideColor').onFinishChange(generateGalaxy)

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