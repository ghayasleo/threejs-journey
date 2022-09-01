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
mesh.position.set(1, -0.6, -1)
mesh.scale.set(2, 0.5, 0.5)
mesh.rotation.reorder("YXZ")
mesh.rotation.y = Math.PI * 0.25
mesh.rotation.x = Math.PI * 0.25
scene.add(mesh)

// axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 3)
camera.lookAt(mesh.position)
scene.add(camera)

// renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

renderer.render(scene, camera)