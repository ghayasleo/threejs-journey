import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

// debug
const gui = new dat.GUI()

// canvas
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFC, 0.3)
directionalLight.position.set(1, 0.25, 0)
// scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xFF0000, 0x0000FF, 0.5)
// scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xFF9000, 0.7, 2.5)
pointLight.position.set(1, -0.5, 1)
const lightHelper = new THREE.PointLightHelper(pointLight)

// scene.add(pointLight, lightHelper)

const rectAreaLight = new THREE.RectAreaLight(0x4E00FF, 2, 3, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
// scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78FF00, 0.5, 10, Math.PI * 0.2, 0.1, 0.25,  1)
spotLight.position.set(0, 1, 1)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLight, spotLightHelper)

// objects

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
material.side = THREE.DoubleSide

// geometry
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

// animation
const clock = new THREE.Clock()

const animation = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animation)
}

animation()