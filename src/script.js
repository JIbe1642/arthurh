import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Tools
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


/**
 * Orbit controls
 */
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;


/**
 * Loading manager
 */

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        requestAnimationFrame( animate );

    },
  
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
     const progressRatio = itemsLoaded / itemsTotal
     console.log(itemUrl, itemsLoaded, itemsTotal)

    }
   )



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader(loadingManager);
const goldTexture = textureLoader.load('textures/gold.jpg')

/**
 * Material
 */
const gold = new THREE.MeshMatcapMaterial({ matcap: goldTexture });

/**
 * Objects
 */
 const geometry = new THREE.BoxGeometry(1, 1, 1)
 const mesh = new THREE.Mesh(geometry, gold)
 scene.add(mesh)
 

/**
 * Animate
 */
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

