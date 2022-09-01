import * as THREE from 'three'
import gsap from 'gsap'
import './style.css'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// scene
const scene = new THREE.Scene()

// box
const geometry = new THREE.BoxGeometry(1, 1, 1)

const positionAttribute = geometry.getAttribute('position');
const colors = [];

const color = new THREE.Color();

for (let i = 0; i < positionAttribute.count; i += 6) {

  color.setHex(0xffffff * Math.random());

  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);

  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
}
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
const material = new THREE.MeshBasicMaterial({ vertexColors: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 3)
scene.add(camera)

// renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

// animation

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })

const tick = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

renderer.render(scene, camera)

tick()