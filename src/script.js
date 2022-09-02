import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "lil-gui"

// debug
const gui = new dat.GUI()

// textures
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

const envMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
])

// canvas
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()

// canvas size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// resize canvas on screen resize
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

// light source
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)

const pointLight = new THREE.PointLight(0xFFFFFF, 0.5)
pointLight.position.set(2, 3, 4)

scene.add(ambientLight, pointLight)

// materials
// // basic
// const material = new THREE.MeshBasicMaterial()
// material.transparent = true
// material.map = doorColorTexture
// material.alphaMap = doorAlphaTexture

// // normal
// const material = new THREE.MeshNormalMaterial({wireframe: false})
// material.flatShading = true

// // matchcap
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// // lambert
// const material = new THREE.MeshLambertMaterial()

// // phong
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188FF)

// // gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

// // toon
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// standard
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.779
// material.roughness = 0.65
// material.map = doorColorTexture

// material.side = THREE.DoubleSide
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 2
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// environment map
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = envMapTexture

// material control
gui.add(material, "metalness", 0, 1, 0.001)
gui.add(material, "roughness", 0, 1, 0.001)
gui.add(material, "aoMapIntensity", 0, 10, 0.001)
gui.add(material, "displacementScale", 0, 1, 0.0001)

// objects

const addBuffetAttr = (obj) => obj.geometry.setAttribute("uv2", new THREE.BufferAttribute(obj.geometry.attributes.uv.array, 2))

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material
)
addBuffetAttr(sphere)
// sphere.position.x = -2.5
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material
)
plane.position.x = -2.5
addBuffetAttr(plane)
// plane.geometry.setAttribute("uv2", new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
)
addBuffetAttr(torus)
torus.position.x = 2.5
scene.add(plane, sphere, torus)

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
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// animation
const clock = new THREE.Clock()

const animate = () => {
  const elapsedTime = clock.getElapsedTime()

  // update objects
  const x = 0.15 * elapsedTime
  const y = 0.1 * elapsedTime
  // sphere.rotation.set(x, y, 0)
  // plane.rotation.set(-1 * x, y, 0)
  // torus.rotation.set(x, y, 0)

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()