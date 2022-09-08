import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as   CANNON from "cannon-es"

/**
 * Debug
 */
const gui = new dat.GUI()
const debugOBJ = {
  createSphere: () =>
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    })
  ,
  createBox: () => createBox(
    Math.random(),
    Math.random(),
    Math.random(),
    { x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 }
  ),
  reset: () => {
    objectsToUpdate.forEach(val => {
      world.removeBody(val.body)
      world.removeBody(val.body)

      scene.remove(val.mesh)
    })
    objectsToUpdate.splice(0, objectsToUpdate.length)
  }
}
gui.add(debugOBJ, "createSphere").name("Create a sphere")
gui.add(debugOBJ, 'createBox').name("Create a box")
gui.add(debugOBJ, 'reset').name("Reset the plane")
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sound
 */
const hitSound = new Audio("/sounds/hit.mp3")

const playSound = (collision) => {
  hitSound.currentTime = 0
  hitSound.volume = Math.abs(((collision.contact.getImpactVelocityAlongNormal() * 100) / 12) * 0.01);
  hitSound.play()
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.allowSleep = true
world.broadphase = new   CANNON.SAPBroadphase(world)

const defaultMaterial = new CANNON.Material("default")

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1,
  restitution: 0.7
})
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

const floorBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
})
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
)
world.addBody(floorBody)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []

const geometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture
})

const createSphere = (radius, position) => {
  // mesh
  const mesh = new THREE.Mesh(geometry, material)
  mesh.scale.set(radius, radius, radius)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // body
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(radius),
    material: defaultMaterial
  })
  body.position.copy(position)
  body.addEventListener("collide", playSound)
  world.addBody(body)

  objectsToUpdate.push({ mesh, body })
}

// createSphere(0.5, { x: 0, y: 3, z: 0 })

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5
})
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.scale.set(width, height, depth)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon.js body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial
  })
  body.position.copy(position)
  body.addEventListener("collide", playSound)
  world.addBody(body)

  // Save in objects
  objectsToUpdate.push({ mesh, body })
}

// createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })

/**
 * Animate
 */
const clock = new THREE.Clock()
let prevTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const delta = elapsedTime - prevTime
  prevTime = delta

  world.step(1 / 60, delta, 3)

  objectsToUpdate.forEach(val => {
    val.mesh.position.copy(val.body.position)
    val.mesh.quaternion.copy(val.body.quaternion)
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()