
import './css/webflow.css'
import './css/normalize.css'
import './css/arthurh.webflow.css'
import './style.css'


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


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
var sizes = {
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
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);


}


/**
 * Orbit controls
 */
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true
controls.enableRotate = false


//controls.enableZoom=false;
//controls.enablePan=false;


/*
controls.minDistance = 0.6
controls.maxDistance = 30
*/


controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
}

controls.touches.ONE = THREE.TOUCH.PAN;
controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;


/**
 * Loading manager
 */

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        requestAnimationFrame(animate);
        document.querySelector('.section-intro').classList.remove('hide')
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
        //console.log(itemUrl, itemsLoaded, itemsTotal)

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

const video = document.querySelector('.main-video');
const videoTexture = new THREE.VideoTexture(video)
videoTexture.magFilter = THREE.LinearFilter;

const material = new THREE.MeshBasicMaterial({ map: videoTexture });

/**
 * Objects
 */
const geometry = new THREE.PlaneGeometry(3, 3)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
//mesh.position.y=.59

mesh.visible = false;

/**
 * Animate
 */

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}


/**
 * UI
 */


document.querySelector('.cta-intro').addEventListener('click',()=>{
    document.querySelector('.section-intro').classList.add('hide')

    setTimeout(()=>{
        document.querySelector('.section-tuto').classList.remove('hide')
        document.querySelector('.logo-title').classList.remove('hide')

    },500)
})



document.querySelector('.cta-tuto').addEventListener('click',()=>{
    document.querySelector('.section-tuto').classList.add('hide')

    setTimeout(()=>{
        document.querySelector('.order-cta').classList.remove('hide')
        document.querySelector('.main-canvas').classList.remove('hide')
        document.body.classList.add('grab')


    },500)

    mesh.visible = true;
})



document.body.addEventListener('mousedown',()=>{
    if(document.body.classList.contains('grab')){
        document.body.classList.add('grabbing')
    }
})

document.body.addEventListener('mouseup',()=>{
        document.body.classList.remove('grabbing')
})