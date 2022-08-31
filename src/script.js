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

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 2
scene.add(camera)

// renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

renderer.render(scene, camera)