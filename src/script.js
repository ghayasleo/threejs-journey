import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "lil-gui"
import './style.css'

// debug
const gui = new dat.GUI()

// get canvas
const canvas = document.getElementById("webgl")

// define canva size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// handle window resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener("dblclick", () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen()
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen()
  } else {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.webkitExitFullscreen()) document.webkitExitFullscreen()
  }
})

// scene
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3)
scene.add(camera)

// renderer
const renderer = new THREE.WebGL1Renderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;

// debug controls
gui.add(mesh.position, "y", -1.2, 1.2, 0.01).name("elevation")
gui.add(mesh, "visible")
gui.add(material, "wireframe")
gui.addColor(material, "color")

// animation

const tick = () => {
  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

renderer.render(scene, camera)

tick()