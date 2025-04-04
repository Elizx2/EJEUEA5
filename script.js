window.scrollTo(0, document.body.scrollHeight);

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
const tolerance = 0.1;

if (Math.abs(point.x - -0.6113261109256412) < tolerance && Math.abs(point.z - 1.8727663601047255) < tolerance) {
  return "CDMX"; // Coordenadas aproximadas para CDMX
}
if (Math.abs(point.x - -2.2276710094366976) < tolerance && Math.abs(point.z - 1.5734913975729814) < tolerance) {
  console.log("Estado detectado: Jalisco");
  return "Jalisco"; // Coordenadas para Jalisco
}
if (Math.abs(point.x - -2.7270868773710486) < tolerance && Math.abs(point.z - 1.2233527600086418) < tolerance) {
  console.log("Estado detectado: Colima");
  return "Colima"; // Coordenadas para Colima
}
if (Math.abs(point.x - 1.7990650252956173) < tolerance && Math.abs(point.z - 2.9411072069900324) < tolerance) {
  console.log("Estado detectado: Chiapas");
  return "Chiapas"; 
}
if (Math.abs(point.x - 0.36269499197700394) < tolerance && Math.abs(point.z - 2.1269175061859977) < tolerance) {
  console.log("Estado detectado: Veracruz");
  return "Veracruz"; 
}
if (Math.abs(point.x - -2.9077804356145918) < tolerance && Math.abs(point.z - -1.0841420040656136) < tolerance) {
  console.log("Estado detectado: Chihuahua");
  return "Chihuahua"; 
}
if (Math.abs(point.x - -0.3426581540528828) < tolerance && Math.abs(point.z - 0.438262170330705) < tolerance) {
  console.log("Estado detectado: Tamaulipas");
  return "Tamauliapas"; 
}
if (Math.abs(point.x - -3.1960592492526803) < tolerance && Math.abs(point.z - 0.4526612132727017) < tolerance) {
  console.log("Estado detectado: Sinaloa");
  return "Sinaloa"; 
}
if (Math.abs(point.x - -1.60348763786101) < tolerance && Math.abs(point.z - -0.8618037688191711) < tolerance) {
  console.log("Estado detectado: Coahuila");
  return "Coahuila"; 
}
return null;
}
