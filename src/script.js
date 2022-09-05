import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import * as dat from 'lil-gui'

const textureLoader = new THREE.TextureLoader()
const texture1 = textureLoader.load("/textures/matcaps/1.png")
const texture2 = textureLoader.load("/textures/matcaps/2.png")
const texture3 = textureLoader.load("/textures/matcaps/3.png")
const texture4 = textureLoader.load("/textures/matcaps/4.png")
const texture5 = textureLoader.load("/textures/matcaps/5.png")
const texture6 = textureLoader.load("/textures/matcaps/6.png")
const texture7 = textureLoader.load("/textures/matcaps/7.png")
const texture8 = textureLoader.load("/textures/matcaps/8.png")
const textures = [
  texture1,
  texture2,
  texture3,
  texture4,
  texture5,
  texture6,
  texture7,
  texture8,
]

console.log((Math.random() * 8).toFixed(0))

// font loading
const fontLoader = new FontLoader()
fontLoader.load("/fonts/telvetica_regular.typeface.json", (font) => {
  console.time('time')

  const textGeometry = new TextGeometry("Ghayas", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 10
  })
  textGeometry.center()

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: texture1 })
  textMaterial.side = THREE.DoubleSide

  const text = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(text)

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

  for (let i = 0; i <= 100; i++) {
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: textures[(Math.random() * 8).toFixed(0)] })
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    scene.add(donut)
  }
  console.timeEnd('time')
})

//debug
const gui = new dat.GUI()

// canvas
const canvas = document.querySelector('#webgl')

// scene
const scene = new THREE.Scene()

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// update canvas size
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

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

  // update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}

animate()