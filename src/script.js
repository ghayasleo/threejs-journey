import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Pre Setting
 */

// utils
const castShadow = (val, recieve = false) => val[recieve ? 'receiveShadow' : 'castShadow'] = true
const shadowMap = (source, width, height, far) => {
  source.shadow.mapSize.width = width;
  source.shadow.mapSize.height = height;
  source.shadow.camera.far = far;
}

// debug
const gui = new dat.GUI()

// canvas
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()

// fog
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

// textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

const repeatTexture = (texture) => {
  texture.repeat.set(6, 6)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
}

repeatTexture(grassColorTexture)
repeatTexture(grassAmbientOcclusionTexture)
repeatTexture(grassNormalTexture)
repeatTexture(grassRoughnessTexture)

/**
 * House
 */
// group
const house = new THREE.Group()
scene.add(house)

// walls
const wallSize = { width: 4, height: 3, depth: 4 }
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallSize.width, wallSize.height, wallSize.depth),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture
  })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = (wallSize.height / 2) + 0.01
house.add(walls)

// roof
const roofSize = { radius: 3.5, height: 1, radialSegment: 4 }
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(roofSize.radius, roofSize.height, roofSize.radialSegment),
  new THREE.MeshStandardMaterial({ color: 0xB35F45 })
)
roof.position.y = wallSize.height + (roofSize.height / 2)
roof.rotation.y = Math.PI / 4
house.add(roof)

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
)
floor.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// door
const doorSize = { width: 2, height: 2 }
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorSize.width, doorSize.height, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = doorSize.height / 2.2
door.position.z = wallSize.width / 2 - 0.03
house.add(door)

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

class Bush {
  constructor(scale, position) {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial)
    bush.scale.set(...scale)
    bush.position.set(...position)
    return bush
  }
}

// bulb
const bulb = new THREE.Group()
bulb.position.set(0, wallSize.height - 0.5, wallSize.width / 2)
house.add(bulb)

const bulbSize = { radius: 0.2, height: 0.2 }
const bulbOrbit = new THREE.Mesh(
  new THREE.ConeGeometry(bulbSize.radius, bulbSize.height, 10, undefined, true),
  new THREE.MeshStandardMaterial({ color: 0x4E504E, side: THREE.DoubleSide })
);
bulb.add(bulbOrbit);

const bush1 = new Bush([0.5, 0.5, 0.5], [0.8, 0.2, 2.2])
const bush2 = new Bush([0.25, 0.25, 0.25], [1.4, 0.1, 2.1])
const bush3 = new Bush([0.4, 0.4, 0.4], [-0.8, 0.1, 2])
const bush4 = new Bush([0.15, 0.15, 0.15], [-1, 0.05, 2.4])

house.add(bush1, bush2, bush3, bush4)

// graves
const graves = new THREE.Group()
scene.add(graves)

const graveSizes = { width: 0.6, height: 1, depth: 0.2 }
const graveGeometry = new THREE.BoxGeometry(graveSizes.width, graveSizes.height, graveSizes.depth)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xB2B6B1 })

for (let i = 0; i <= 50; i++) {
  const angle = Math.random() * (Math.PI * 2)
  const radius = (wallSize.width - 1) + Math.random() * 6
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, (graveSizes.height / 2) - 0.05, z)
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4

  castShadow(grave)
  castShadow(grave, true)

  graves.add(grave)
}

/**
 * Lights
 */
// ambient light
const ambientLight = new THREE.AmbientLight(0xB9D5FF, 0.2)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// directional light
const moonLight = new THREE.DirectionalLight(0xB9D5FF, 0.2)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name("moonlight")
const moonLightHelper = new THREE.DirectionalLightHelper(moonLight)
moonLightHelper.visible = false
scene.add(moonLight, moonLightHelper)

// door light
const doorLight = new THREE.SpotLight(0xFF7D46, 4, 3, -1)
doorLight.rotation.set(2, 2, 5)
doorLight.position.set(0, 2.5, 2.06)
doorLight.target.position.set(0, -2, 1.8);
const doorLightHelper = new THREE.SpotLightHelper(doorLight)
doorLightHelper.visible = false
house.add(doorLight, doorLightHelper, doorLight.target)

// ghosts
const ghost1 = new THREE.PointLight(0xFF00FF, 2, 3)
const ghost2 = new THREE.PointLight(0x00FFFF, 2, 3)
const ghost3 = new THREE.PointLight(0x0000FF, 5, 3)


scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// resize canvas
window.addEventListener('resize', () => {
  // update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Post Setting
 */
// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor(0x262837)

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

castShadow(moonLight)
castShadow(doorLight)
castShadow(ghost1)
castShadow(ghost2)
castShadow(ghost3)
castShadow(walls)
castShadow(bush1)
castShadow(bush2)
castShadow(bush3)
castShadow(bush4)
castShadow(floor, true)

shadowMap(doorLight, 256, 256, 7)
shadowMap(ghost1, 256, 256, 7)
shadowMap(ghost2, 256, 256, 7)
shadowMap(ghost3, 256, 256, 7)

/**
 * Animation
 */
const clock = new THREE.Clock()

const animation = () => {
  const time = clock.getElapsedTime()

  const speed = time * 0.3
  moonLight.position.x = Math.cos(speed) * 4
  moonLight.position.z = Math.sin(speed) * 4
  moonLightHelper.update()

  const ghost1Angle = time * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * (5 + Math.sin(time * 0.32))
  ghost1.position.z = Math.sin(ghost1Angle) * (5 + Math.sin(time * 0.32))
  ghost1.position.y = Math.sin(time * 3)

  const ghost2Angle = - time * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * (4 + Math.sin(time * 0.32))
  ghost2.position.z = Math.sin(ghost2Angle) * (4 + Math.sin(time * 0.32))
  ghost2.position.y = Math.sin(time * 4) + Math.sin(time * 2.5)

  const ghost3Angle = time * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(time * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(time * 0.5))
  ghost3.position.y = Math.sin(time * 4) + Math.sin(time * 2.5)

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)

  // call animation again on the next frame
  window.requestAnimationFrame(animation)
}

animation()
