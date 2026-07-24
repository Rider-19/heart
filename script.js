const canvas = document.getElementById("bg");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 45;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const heartPoints = [];

function heart(t){

    const x = 16 * Math.pow(Math.sin(t),3);

    const y =
        13*Math.cos(t)
        -5*Math.cos(2*t)
        -2*Math.cos(3*t)
        -Math.cos(4*t);

    return new THREE.Vector3(x,y,0);

}

for(let i=0;i<2500;i++){

    const t=Math.random()*Math.PI*2;

    const p=heart(t);

    p.multiplyScalar(0.9+Math.random()*0.2);

    p.x+=(Math.random()-0.5)*0.8;
    p.y+=(Math.random()-0.5)*0.8;
    p.z=(Math.random()-0.5)*6;

    heartPoints.push(p.x,p.y,p.z);

}

const geometry=new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        heartPoints,
        3
    )
);

const material=new THREE.PointsMaterial({

    color:0xff3366,

    size:0.28,

    transparent:true,

    opacity:0.9,

    blending:THREE.AdditiveBlending,

    depthWrite:false

});

const heartParticles=new THREE.Points(
    geometry,
    material
);

scene.add(heartParticles);

const stars=[];

for(let i=0;i<800;i++){

    stars.push(
        (Math.random()-0.5)*250,
        (Math.random()-0.5)*250,
        (Math.random()-0.5)*250
    );

}

const starGeometry=new THREE.BufferGeometry();

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        stars,
        3
    )
);

const starMaterial=new THREE.PointsMaterial({

    color:0xffffff,

    size:0.18,

    transparent:true,

    opacity:0.7

});

const starField=new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(starField);
// =====================
// Mouse Controls
// =====================

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

});

// =====================
// Window Resize
// =====================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// =====================
// Clock
// =====================

const clock = new THREE.Clock();
// =====================
// Twinkling Stars
// =====================

let starPulse = 0;

function updateStars() {

    starPulse += 0.02;

    starMaterial.opacity =
        0.45 + Math.sin(starPulse) * 0.25;

}

// =====================
// Heart Breathing Effect
// =====================

function updateHeart() {

    const scale =
        1 + Math.sin(clock.getElapsedTime() * 2.2) * 0.05;

    heartParticles.scale.set(scale, scale, scale);

}

// =====================
// Auto Camera Orbit
// =====================

let orbit = 0;

function updateCamera() {

    orbit += 0.0015;

    camera.position.x += Math.sin(orbit) * 0.015;

    camera.position.z = 45 + Math.cos(orbit) * 0.3;

}

// =====================
// Extra Floating Glow
// =====================

const ambient = new THREE.AmbientLight(0xff6699, 1.2);
scene.add(ambient);

// =====================
// Replace animate()
// =====================

function animate() {

    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    heartParticles.rotation.y += 0.002;
    heartParticles.rotation.x = Math.sin(t * 0.5) * 0.12;

    heartParticles.position.y = Math.sin(t * 1.4) * 0.7;

    material.size = 0.28 + Math.sin(t * 4) * 0.05;
    material.opacity = 0.75 + Math.sin(t * 3) * 0.2;

    updateStars();
    updateHeart();
    updateCamera();

    starField.rotation.y += 0.0008;
    starField.rotation.x += 0.0003;

    camera.position.x +=
        (mouseX * 8 - camera.position.x) * 0.05;

    camera.position.y +=
        (mouseY * 6 - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}

animate();