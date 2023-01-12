
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

const legend= document.querySelector('.legend')

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
controls.zoomSpeed = -1

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

let tracks=[
    {name:"La vie",x:100,y:110,element:'.p0',content:`“J’ai écouté Léo ferré et j’ai écrit cette chanson d’un jet, en deux heures, sans douter. Toujours dans l’idée de l’ombre et de la lumière, Eros et Thanatos, la vie comme voyage initiatique…”`},
    {name:"La route",x:48,y:-7,element:'.p1',content:`“Un ami proche a accompagné sa femme trois ans dans une lutte âpre contre un cancer grave. Elle a gagné la bataille. J’ai demandé à mon ami qu’est-ce qu’il retirait de cette expérience si intense. Il m’a répondu : maintenant quand j’ai un rêve je le vis, je n’attends plus, je ne le reporte pas.”  `},  
    {name:"L'ocean",x:-10,y:-26,element:'.p2',content:`“Marcher sur les immenses plages désertes des Landes et penser à ceux qu’on aime.”`},
    {name:"Le secret",x:-100,y:-10,element:'.p3',content:`“Une des nombreuses histoires de la vie de mon père. Une histoire d’abus qui a duré longtemps. Tout doit être dit, tout doit être su, tout se saura…” `},
    {name:"El magnifico",x:-90,y:-90,element:'.p4',content:`“La vision d’un oiseau de feu. Un conte russe que j’adorais quand j’étais enfant. Une histoire d’amitié dans la tourmente.”`},
    {name:"Titanic",x:10,y:-60,element:'.p5',content:`“Une parabole poético-politique. Dans l’orchestre du Titanic, il y avait un musicien français qui a dû continuer à jouer jusqu’au bout, la musique empêchait, apparemment, les gens de paniquer. Je me suis imaginé à sa place, jouant pour les étoiles et la nuit et la vie.”`},
    {name:"Divin blaspheme",x:-115,y:40,element:'.p6',content:`“Une chanson déclaration hommage pour ma reine Brigitte Fontaine. Ma petite fée bizarre qui était là à ma naissance et qui ne m’a jamais quitté. Une artiste fantastique et une source continue d’inspiration : audace, poésie, humour, créativité débridée… “ `},
    {name:"L innocence",x:-65,y:-30,element:'.p7',content:`“Une chanson dramatique et excitante de crise de couple ou, peut-être, chacun pourra se reconnaître.” `},
    {name:"Addict",x:65,y:-90,element:'.p8',content:`“Nous vivons dans une société basée sur l’addiction, à tous les niveaux, à toutes les échelles, l’addiction comme façon de vivre, de consommer, de rêver. L’addiction non pas tolérée mais encouragée dans des proportions délirantes, une société saine ?”`},
    {name:"La folie du controle",x:130,y:70,element:'.p9',content:`“Petite réflexion philosophique sur la pulsions archaïque et paranoïaque des gens de pouvoir pour le contrôle et la surveillance, sous toutes ses formes. Sur la disparition programmée de contre-pouvoirs efficaces. Inspiré de faits réels et récents.”  `},
    {name:"Cet amour me tue",x:120,y:-50,element:'.p10',content:`“Cette chanson est dans le film « Sound of Metal » de Darius Marder où Mathieu Amalric et Olivia Cooke la fredonne. Je l’ai ensuite chanté avec Martha Wainwright pour la BO du film. J’ai refait une version pour le disque avec des chœurs de Léonore et des cordes-samples très sombres de Nicolas Repac.” `},
    {name:"L etoile",x:-120,y:-130,element:'.p11',content:`“Une comptine cosmique et une chanson d’amour pour ma femme. Avec la harpe merveilleuse de Pauline Haaset les matières sonores si riches de Thomas Bloch aux Ondes Martenots et au Cristal Baschet.”`},
]

let points = [];

const geo = new THREE.SphereGeometry(.025, 32, 16);
const mat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });


tracks.forEach((track,index)=>{
    points.push(new THREE.Mesh(geo,mat));
    points[index].element=document.querySelector(track.element)
    scene.add(points[index]);
    points[index].position.x=track.x/100
    points[index].position.y=-track.y/100
})



function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    for (const point of points) {
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width * 0.5 - 11.5
        const translateY = -screenPosition.y * sizes.height * 0.5 - 11.5

        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
      }
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
        document.querySelector('.points').classList.remove('hide')

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

document.querySelectorAll('.point').forEach(point=>{

    point.addEventListener('click',()=>{
        var num=point.dataset.number

        document.querySelector('.player-title').innerHTML=tracks[num].name
        document.querySelector('.player-text').innerHTML=tracks[num].content

        document.querySelector('.section-player').classList.remove('hide')
    })

    point.addEventListener('mouseover',()=>{
        var num=point.dataset.number
        document.querySelector('.point-text').innerHTML=tracks[num].name
        legend.classList.remove('hide')
    })

    point.addEventListener('mouseleave',()=>{
       legend.classList.add('hide')
    })

})



document.querySelector('.section-player').addEventListener('click',()=>{
    document.querySelector('.section-player').classList.add('hide')
})

const mouse = new THREE.Vector2()

document.body.addEventListener('mousemove',(e)=>{
    var iks =  e.clientX 
    var igrek =  e.clientY 

    mouse.x = iks / sizes.width * 2 - 1
    mouse.y = -(igrek / sizes.height) * 2 + 1

    var translateX = mouse.x * sizes.width * 0.5
    var translateY = -mouse.y * sizes.height * 0.5 

    legend.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
})