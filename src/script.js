import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import * as dat from 'lil-gui'

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load("/textures/matcaps/1.png")

// font loading
const fontLoader = new FontLoader()
fontLoader.load("/fonts/telvetica_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Ghayas", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3
  })
  // centering ( method 1 )
  // textGeometry.computeBoundingBox()
  // const max = textGeometry.boundingBox.max
  // const bevel = textGeometry.parameters.options.bevelSize
  // const thickness = textGeometry.parameters.options.bevelThickness
  // textGeometry.translate(-(max.x - bevel) * 0.5, -(max.y - bevel) * 0.5, -(max.z - thickness) * 0.5)

  // centering ( method 2 )
  textGeometry.center()

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  material.side = THREE.DoubleSide

  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)

  console.time('donuts')

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

  for (let i = 0; i <= 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    scene.add(donut)
  }
  console.timeEnd('donuts')
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

  // update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}

animate()