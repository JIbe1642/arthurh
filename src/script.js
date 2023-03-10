
import './css/webflow.css'
import './css/normalize.css'
import './css/arthurh.webflow.css'
import './style.css'


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'three'


// Tools
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));


// Canvas
const canvas = document.querySelector('canvas.webgl')

//divers
const legend = document.querySelector('.legend')
const bar = document.querySelector('.playing')
const cursor = document.querySelector('.player-cursor')
const zoom = document.querySelector('.zoom-inside')
const bulle = document.querySelector('.bulle')
const pointsDiv = document.querySelector('.points')
const exMove = document.querySelector('.ex-move')
const exZoom = document.querySelector('.ex-zoom')


var audio_track = new Audio();

var moveZoom = false;


var randomMode = false;
var loopMode = false;


const raycaster = new THREE.Raycaster()
const objectsToTest = []

const middle = new Vector3(0, 0, 0)
const cover = new Vector3(0, 0, 0)

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
var sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

var isMobile = window.matchMedia('(max-width: 480px)').matches;

if (isMobile) {
    document.querySelector('.main-video').setAttribute('src', 'videos/video_mobile.mp4')
}

console.log(isMobile)

var zoomTo = isMobile ? 4 : 2.5;


/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
camera.position.z = zoomTo
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

    isMobile = window.matchMedia('(max-width: 480px)').matches;

    if (isMobile) {
        document.querySelector('.main-video').setAttribute('src', 'videos/video_mobile.mp4')
    }

}


/**
 * Orbit controls
 */
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true
controls.enableRotate = false
controls.zoomSpeed = .6

//controls.enableZoom=false;
controls.enablePan = true;

controls.minDistance = .5
controls.maxDistance = 4.5

controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
}

controls.touches.ONE = THREE.TOUCH.PAN;
controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;




canvas.addEventListener('mousedown', () => {


    if (!exMove.classList.contains('hide')) {
        exMove.classList.add('hide')
    }

})


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

const transparent = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });

/**
 * Objects
 */
const geometry = new THREE.PlaneGeometry(3, 3)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.visible = false;

const arthurGeo = new THREE.PlaneGeometry(.5, 1.4)
const arthur = new THREE.Mesh(arthurGeo, transparent)
scene.add(arthur)

arthur.position.z = .1
arthur.position.y = -.7
arthur.position.x = .1

objectsToTest.push(arthur)

/**
 * Animate
 */

let tracks = [
    { name: "La vie", x: 90, y: 112, element: '.p0', content: `???J???ai ??cout?? L??o ferr?? et j???ai ??crit cette chanson d???un jet, en deux heures, sans douter. Toujours dans l???id??e de l???ombre et de la lumi??re, Eros et Thanatos, la vie comme voyage initiatique??????` },
    { name: "La route", x: 30, y: -7, element: '.p1', content: `???Un ami proche a accompagn?? sa femme trois ans dans une lutte ??pre contre un cancer grave. Elle a gagn?? la bataille. J???ai demand?? ?? mon ami qu???est-ce qu???il retirait de cette exp??rience si intense. Il m???a r??pondu : maintenant quand j???ai un r??ve je le vis, je n???attends plus, je ne le reporte pas.???  ` },
    { name: "L'ocean", x: -20, y: -30, element: '.p2', content: `???Marcher sur les immenses plages d??sertes des Landes et penser ?? ceux qu???on aime.???` },
    { name: "Le secret", x: -100, y: -10, element: '.p3', content: `???Une des nombreuses histoires de la vie de mon p??re. Une histoire d???abus qui a dur?? longtemps. Tout doit ??tre dit, tout doit ??tre su, tout se saura?????? ` },
    { name: "El magnifico", x: -90, y: -90, element: '.p4', content: `???La vision d???un oiseau de feu. Un conte russe que j???adorais quand j?????tais enfant. Une histoire d???amiti?? dans la tourmente.???` },
    { name: "Titanic", x: 0, y: -60, element: '.p5', content: `???Une parabole po??tico-politique. Dans l???orchestre du Titanic, il y avait un musicien fran??ais qui a d?? continuer ?? jouer jusqu???au bout, la musique emp??chait, apparemment, les gens de paniquer. Je me suis imagin?? ?? sa place, jouant pour les ??toiles et la nuit et la vie.???` },
    { name: "Divin blaspheme", x: -115, y: 40, element: '.p6', content: `???Une chanson d??claration hommage pour ma reine Brigitte Fontaine. Ma petite f??e bizarre qui ??tait l?? ?? ma naissance et qui ne m???a jamais quitt??. Une artiste fantastique et une source continue d???inspiration : audace, po??sie, humour, cr??ativit?? d??brid??e??? ??? ` },
    { name: "L'innocence", x: -68, y: -30, element: '.p7', content: `???Une chanson dramatique et excitante de crise de couple ou, peut-??tre, chacun pourra se reconna??tre.??? ` },
    { name: "Addict", x: 70, y: -70, element: '.p8', content: `???Nous vivons dans une soci??t?? bas??e sur l???addiction, ?? tous les niveaux, ?? toutes les ??chelles, l???addiction comme fa??on de vivre, de consommer, de r??ver. L???addiction non pas tol??r??e mais encourag??e dans des proportions d??lirantes, une soci??t?? saine ????` },
    { name: "La folie du controle", x: 110, y: 60, element: '.p9', content: `???Petite r??flexion philosophique sur la pulsions archa??que et parano??aque des gens de pouvoir pour le contr??le et la surveillance, sous toutes ses formes. Sur la disparition programm??e de contre-pouvoirs efficaces. Inspir?? de faits r??els et r??cents.???  ` },
    { name: "Cet amour me tue", x: 116, y: -80, element: '.p10', content: `???Cette chanson est dans le film ?? Sound of Metal ?? de Darius Marder o?? Mathieu Amalric et Olivia Cooke la fredonne. Je l???ai ensuite chant?? avec Martha Wainwright pour la BO du film. J???ai refait une version pour le disque avec des ch??urs de L??onore et des cordes-samples tr??s sombres de Nicolas Repac.??? ` },
    { name: "L'etoile", x: -120, y: -130, element: '.p11', content: `???Une comptine cosmique et une chanson d???amour pour ma femme. Avec la harpe merveilleuse de Pauline Haaset les mati??res sonores si riches de Thomas Bloch aux Ondes Martenots et au Cristal Baschet.???` },
]

let points = [];

const geo = new THREE.SphereGeometry(.025, 32, 16);
const mat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });

const allPoints = new THREE.Group();
scene.add(allPoints);

tracks.forEach((track, index) => {
    points.push(new THREE.Mesh(geo, mat));
    points[index].element = document.querySelector(track.element)
    allPoints.add(points[index]);
    points[index].position.x = track.x / 100
    points[index].position.y = -track.y / 100
})



function animate() {
    requestAnimationFrame(animate);


    /*
    var speed=range(.5,4.5,0,100,camera.position.z)

    var iks=-mouse.x*speed
    var igrek=mouse.y*speed

    cover.x+=mouse.x/10


    mesh.position.x=lerp(mesh.position.x,cover.x,.01)

    /*
    mesh.position.x=allPoints.position.x=-mouse.x/2
    mesh.position.y=allPoints.position.y=-mouse.y/2
    */

    for (const point of points) {

        const newPosition = point.position.clone()
        const screenPosition = newPosition.add(allPoints.position)
        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width * 0.5 - 11.5
        const translateY = -screenPosition.y * sizes.height * 0.5 - 11.5

        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }


    const bullePosition = middle.clone()
    bullePosition.project(camera)

    const translateXbulle = bullePosition.x * sizes.width * 0.5 - 11.5
    const translateYbulle = -bullePosition.y * sizes.height * 0.5 - 11.5

    bulle.style.transform = `translate(${translateXbulle}px, ${translateYbulle}px)`


    if (audio_track.duration) {

        var percent = audio_track.currentTime / audio_track.duration * 100;
        bar.style.width = percent + '%';

        cursor.style.transform = "translateX(" + percent / 100 * 240 + "px)"

    } else {
        bar.style.width = '0%';
        cursor.style.transform = "translateX(0px)"
    }

    var z_percent = 100 - (camera.position.z - .5) / 4 * 100
    zoom.style.height = z_percent + '%';

    controls.update();

    zoomTo=clamp(zoomTo,.5,4.5)

    if (moveZoom) {
        camera.position.z = lerp(camera.position.z, zoomTo, .05)
    }

    /*
    canvas.style.transform = `translate(${iks}px, ${igrek}px)`
    pointsDiv.style.transform = `translate(${iks}px, ${igrek}px)`
    */


    if (!exZoom.classList.contains('hide') && camera.position.z != zoomTo) {
        moveZoom = false

        exZoom.classList.add('hide')
        exMove.classList.remove('hide')
    }

    camera.position.x = clamp(camera.position.x, -1.5, 1.5)
    camera.position.y = clamp(camera.position.y, -1.5, 1.5)

    controls.target.x = clamp(controls.target.x, -1.5, 1.5)
    controls.target.y = clamp(controls.target.y, -1.5, 1.5)

    renderer.render(scene, camera);
}


/**
 * UI
 */

document.querySelector('canvas').addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objectsToTest)
    if (intersects.length > 0) {
        bulle.classList.remove('hide')
        setTimeout(() => {
            bulle.classList.add('hide')
        }, 3000)
    }
})


document.querySelector('.cta-intro').addEventListener('click', () => {
    document.querySelector('.section-intro').classList.add('hide')

    setTimeout(() => {
        document.querySelector('.section-tuto').classList.remove('hide')
        document.querySelector('.logo-title').classList.remove('hide')
    }, 500)
})

document.querySelector('.sound-wrapper').addEventListener('click', () => {
    document.querySelector('.section-intro').classList.add('hide')

    setTimeout(() => {
        document.querySelector('.section-tuto').classList.remove('hide')
        document.querySelector('.logo-title').classList.remove('hide')
    }, 500)
})



const openCover = () => {
    document.querySelector('.section-tuto').classList.add('hide')

    setTimeout(() => {
        document.querySelector('.order-cta').classList.remove('hide')
        document.querySelector('.main-canvas').classList.remove('hide')
        document.body.classList.add('grab')
        document.querySelector('.points').classList.remove('hide')
        document.querySelector('.zoom-indic').classList.remove('hide')
        document.querySelector('.explain').classList.remove('hide')
    }, 500)

    mesh.visible = true;
}

document.querySelector('.cta-tuto').addEventListener('click', () => {
    openCover();
})

document.querySelector('.lavie').addEventListener('click', () => {
    openCover();
})


document.body.addEventListener('mousedown', () => {
    if (document.body.classList.contains('grab')) {
        document.body.classList.add('grabbing')
    }
})

document.body.addEventListener('mouseup', () => {
    document.body.classList.remove('grabbing')
})

var n_track = 0;

const load_track = (num, direct) => {

    document.querySelector('.push-yt').classList.add('hide')
    document.querySelector('.zoom-indic').classList.add('hide')

    n_track = num;
    audio_track.pause();


    document.querySelector('.section-player').classList.remove('hide')

    /*
    document.querySelector('.player-video').classList.remove('video-p0', 'video-p1', 'video-p2', 'video-p3', 'video-p4', 'video-p5', 'video-p6', 'video-p7', 'video-p8', 'video-p9', 'video-p10', 'video-p11')
    document.querySelector('.player-video').classList.add('video-p' + num)
    */

    var time = direct ? 0 : 1000;

    setTimeout(() => {
        document.querySelector('.player-title').innerHTML = tracks[num].name
        if (num == 0) {
            player.load('gl2xAo1a0_4', [true])
            document.querySelector('.push-yt').classList.remove('hide')
            document.querySelector('.push-yt-mobile').classList.remove('hide')
            document.querySelector('.push-yt-mobile').setAttribute('href', 'https://www.youtube.com/watch?v=gl2xAo1a0_4')

        } else if (num == 5) {
            player.load('b2Yg_T_Mk0k', [true])
            document.querySelector('.push-yt').classList.remove('hide')
            document.querySelector('.push-yt-mobile').classList.remove('hide')
            document.querySelector('.push-yt-mobile').setAttribute('href', 'https://m.youtube.com/watch?v=b2Yg_T_Mk0k')
        }
        else {
            document.querySelector('.push-yt').classList.add('hide')
            document.querySelector('.push-yt-mobile').classList.add('hide')
        }

        document.querySelector('.player-text').innerHTML = tracks[num].content
        document.querySelector('.player-bottom').classList.remove('hide')
        document.querySelector('.player-top').classList.remove('hide')

        audio_track.src = ('sounds/' + num + '.mp3');
        audio_track.play();
        document.querySelector('.icon-play').classList.add('hide')
        document.querySelector('.icon-pause').classList.remove('hide')

        document.querySelector('.player-video').setAttribute('src', 'videos/mini/mini_' + num + '_2.mp4')


    }, time)

}


document.querySelectorAll('.point').forEach(point => {

    point.addEventListener('click', () => {
        if(document.querySelector('.section-tuto').classList.contains('hide')){

            console.log('open')

            load_track(point.dataset.number, true);
            document.body.classList.remove('grab')
            document.querySelector('.explain').classList.add('hide')
        }

    })

    point.addEventListener('mouseover', () => {
        var num = point.dataset.number
        document.querySelector('.point-text').innerHTML = tracks[num].name
        legend.classList.remove('hide')
    })

    point.addEventListener('mouseleave', () => {
        legend.classList.add('hide')
    })

})

//previous next

const nextTrack = () => {
    if (randomMode) {
        var n = Math.round(Math.random() * 11)

        while (n == n_track) {
            n = Math.round(Math.random() * 11)
        }

        n_track = n;
        document.querySelector('.player-bottom').classList.add('hide')
        document.querySelector('.player-top').classList.add('hide')
        load_track(n_track, false);

    } else {
        n_track++;
        n_track %= 12;

        document.querySelector('.player-bottom').classList.add('hide')
        document.querySelector('.player-top').classList.add('hide')
        load_track(n_track, false);
    }

}



document.querySelector('.next').addEventListener('click', () => {
    nextTrack();
})

document.querySelector('.previous').addEventListener('click', () => {
    n_track += 11;
    n_track %= 12;

    document.querySelector('.player-bottom').classList.add('hide')
    document.querySelector('.player-top').classList.add('hide')
    load_track(n_track, false);
})

//close

document.querySelector('.player-top').addEventListener('click', () => {
    document.querySelector('.section-player').classList.add('hide')
    document.querySelector('.zoom-indic').classList.remove('hide')
    document.body.classList.add('grab')
    audio_track.pause();
    document.querySelector('.push-yt').classList.add('hide')
    document.querySelector('.explain').classList.remove('hide')
})



//legende

const mouse = new THREE.Vector2()

document.body.addEventListener('mousemove', (e) => {
    var iks = e.clientX
    var igrek = e.clientY

    mouse.x = iks / sizes.width * 2 - 1
    mouse.y = -(igrek / sizes.height) * 2 + 1

    var translateX = mouse.x * sizes.width * 0.5
    var translateY = -mouse.y * sizes.height * 0.5

    legend.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
})


//sound

document.querySelector('.control-main').addEventListener('mousedown', () => {
    if (audio_track.paused) {
        audio_track.play()
        document.querySelector('.icon-play').classList.add('hide')
        document.querySelector('.icon-pause').classList.remove('hide')
    } else {
        audio_track.pause()
        document.querySelector('.icon-play').classList.remove('hide')
        document.querySelector('.icon-pause').classList.add('hide')
    }
})

document.querySelector('.bar-control').addEventListener('click', (e) => {
    audio_track.currentTime = audio_track.duration * (e.offsetX - 6) / 240;
})



//zoom

document.querySelector('.zoom-plus').addEventListener('click', () => {
    moveZoom = true
    zoomTo = zoomTo - 1;
})

document.querySelector('.zoom-moins').addEventListener('click', () => {
    moveZoom = true
    zoomTo = zoomTo + 1;
})

document.querySelector('.zoom-bar-wrapper').addEventListener('click', (e) => {
    moveZoom = true
    zoomTo = range(0, 180, .5, 4.5, e.offsetY)
})

//random loop

document.querySelector('.random').addEventListener('click', (e) => {

    if (!document.querySelector('.random').classList.contains('active')) {
        randomMode = true
        document.querySelector('.random').classList.add('active')
    } else {
        randomMode = false
        document.querySelector('.random').classList.remove('active')
    }

})

document.querySelector('.loop').addEventListener('click', (e) => {

    if (!document.querySelector('.loop').classList.contains('active')) {
        loopMode = true
        document.querySelector('.loop').classList.add('active')
    } else {
        loopMode = false
        document.querySelector('.loop').classList.remove('active')
    }

})



audio_track.addEventListener('ended', () => {
    if (loopMode) {
        nextTrack();
    }
})

//youtube


const YTPlayer = require('yt-player')
const player = new YTPlayer('#player', { 'controls': 0, 'playsinline': 1, 'loop': 1 })
player.mute();

const YTPlayerBig = require('yt-player')
const playerBig = new YTPlayerBig('#player-big', { 'playsinline': 1, 'loop': 1 })

document.querySelector('.push-yt').addEventListener('click', () => {

    if (n_track == 0) {
        playerBig.load('gl2xAo1a0_4', [true])
    }

    if (n_track == 5) {
        playerBig.load('b2Yg_T_Mk0k', [true])
    }

    document.querySelector('.yt-big-player').classList.remove('hide')
    audio_track.pause();
})

document.querySelector('.cta-close-big').addEventListener('click', () => {
    playerBig.pause();
    audio_track.play();
    document.querySelector('.yt-big-player').classList.add('hide')
})

document.querySelector('.push-yt-mobile').addEventListener('click', () => {
    audio_track.pause();
})

window.addEventListener('load', () => {
    document.querySelector('.white').classList.add('hide')
})

document.querySelector('.player-video').addEventListener('play',()=>{
    document.querySelector('.player-video').classList.remove('hide')
    console.log('play')
})

document.querySelector('.player-video').addEventListener('loadstart',()=>{
    document.querySelector('.player-video').classList.add('hide')
    console.log('load')
})