window.scrollTo(0, document.body.scrollHeight);


  window.onload = function() {
    window.scrollTo(0, 0);
  };


import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

//tamaño y color de la ventana

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x49100a);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

//cámara

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);


//controles

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 8;
controls.minPolarAngle = 1.0;
controls.maxPolarAngle = 1.0;
controls.autoRotate = false;
controls.minAzimuthAngle = 0; //esto es para limitar el giro horizontal
controls.maxAzimuthAngle = 0;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();


//luz
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Luz blanca y de intensidad 1
scene.add(ambientLight);

//aquí se insertó el modelo
const loader = new GLTFLoader();
loader.load('mapa_mexico.glb', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(-2, 1.05, -1);
  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';

  console.log("Objetos en la escena:");
  mesh.traverse((obj) => {
    console.log(obj.name); // Muestra los nombres de todos los objetos en el modelo
  });


}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

//Aquí empieza la parte de raycasting 

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


//aquí se coloca la información de cada estado 
const estadosInfo ={
 "CDMX":"CNDH....al IMSS por caso de violencia obstétrica.",
 "Jalisco":"CNDH....al IMSS por caso de violencia obstétrica.",
 "Colima":"CNDH....al IMSS por caso de violencia obstétrica."
};

document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event) {
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY / renderer.domElement.clientHeight) * 2 - 1);

raycaster.setFromCamera(mouse, camera);
const intersections = raycaster.intersectObjects(scene.children, true);

if (intersections.length > 0) {
  const point = intersections[0].point;
  console.log("Coordenadas del clic", point); 

  const estadoNombre = detectarEstadoPorCoordenadas(point);

  // Muestra la información del estado en un modal
  if (estadoNombre) {
    mostrarInfoEstado(estadoNombre, estadosInfo[estadoNombre]);
  } else {
    console.log("No se encontró estado en estas coordenadas");
  }
} else {
  console.log("No se detectó intersección en la escena.");
}
}

function mostrarInfoEstado(nombre, info) {
let modal = document.createElement("div");
modal.innerHTML = `<h2>${nombre}</h2><p>${info}</p>`;
modal.style.position = "fixed";
modal.style.top = "50%";
modal.style.left = "50%";
modal.style.transform = "translate(-50%, -50%)";
modal.style.padding = "20px";
modal.style.background = "white";
modal.style.border = "1px solid black";
modal.style.zIndex = "1000";

let closeButton = document.createElement("button");
closeButton.innerText = "Cerrar";
closeButton.onclick = () => document.body.removeChild(modal);
modal.appendChild(closeButton);

document.body.appendChild(modal);
}


function detectarEstadoPorCoordenadas(point) {
const tolerance = 0.3;

if (Math.abs(point.x - -0.6926023077635488) < tolerance && Math.abs(point.z - 0.8687557168521156) < tolerance) {
  return "CDMX"; // Coordenadas para CDMX
}
if (Math.abs(point.x - -2.6321702995841645) < tolerance && Math.abs(point.z - 0.45387550003285604) < tolerance) {
  console.log("Estado detectado: Jalisco");
  return "Jalisco"; // Coordenadas para Jalisco
}
if (Math.abs(point.x - -2.6422296488205923) < tolerance && Math.abs(point.z - 0.8810797866539115) < tolerance) {
  console.log("Estado detectado: Colima");
  return "Colima"; // Coordenadas para Colima
}
if (Math.abs(point.x - 1.9353647216149512) < tolerance && Math.abs(point.z - 2.2096030274395604) < tolerance) {
  console.log("Estado detectado: Chiapas");
  return "Chiapas"; 
}
if (Math.abs(point.x - 0.28379765038424276) < tolerance && Math.abs(point.z - 0.7626811665431461) < tolerance) {
  console.log("Estado detectado: Veracruz");
  return "Veracruz"; 
}
if (Math.abs(point.x - -3.732214351574595) < tolerance && Math.abs(point.z - -3.720167990324372) < tolerance) {
  console.log("Estado detectado: Chihuahua");
  return "Chihuahua"; 
}
if (Math.abs(point.x - -0.447495911289443) < tolerance && Math.abs(point.z - -1.4212034342906819) < tolerance) {
  console.log("Estado detectado: Tamaulipas");
  return "Tamauliapas"; 
}
if (Math.abs(point.x - -4.03752017795801) < tolerance && Math.abs(point.z - -1.7688413537978693) < tolerance) {
  console.log("Estado detectado: Sinaloa");
  return "Sinaloa"; 
}
if (Math.abs(point.x - -1.933498766022701) < tolerance && Math.abs(point.z - -2.8621781115412297) < tolerance) {
  console.log("Estado detectado: Coahuila");
  return "Coahuila"; 
}
return null;
}
