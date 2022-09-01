import * as THREE from 'three'
import './style.css'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// scene
const scene = new THREE.Scene()

// box
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 3)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

// animation

let time = Date.now()

const tick = () => {
  const currentTime = Date.now()
  const delta = currentTime - time
  time = currentTime
  console.log(delta)

  mesh.rotation.y += 0.002 * delta

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()