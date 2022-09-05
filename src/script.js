import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { MeshBasicMaterial } from 'three'

// texture
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load("/textures/shadows/baked.jpg")
const simpleShadow = textureLoader.load("/textures/shadows/simple.jpg")

// debug
const gui = new dat.GUI()

// canvas
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.SpotLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 5
directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.right = 1
directionalLight.shadow.camera.bottom = -1
directionalLight.shadow.camera.left = -1

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

// objects

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
material.side = THREE.DoubleSide

// geometry
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new MeshBasicMaterial({ map: bakedShadow })
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true

scene.add(sphere, plane)

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// update canvas size on resize
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

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// animation
const clock = new THREE.Clock()

const animation = () => {
  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)

  // call animation again on the next frame
  window.requestAnimationFrame(animation)
}

animation()