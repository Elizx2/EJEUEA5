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
loader.load('assets/Mapa_Pines_F.glb', (gltf) => {
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
const estadosInfo = {
  "Chiapas" : {
   texto: "Chiapas",
   video: "assets/videos/Caso_1.mp4"
 },
 "Veracruz" : {
   texto: "C",
   video: "assets/videos/Caso_2.mp4"
 },
 "Chihuhua1" : {
   texto: "C",
   video: "assets/videos/Caso_3.mp4"
 },
   "Tamauliapas|": {
     texto: "CNDH....al IMSS por caso de violencia obstétrica.",
     video: "assets/videos/Caso_4.mp4"
   },
"Tamauliapas2": {
     texto: "CNDH....al IMSS por caso de violencia obstétrica.",
     video: "assets/videos/Caso_5.mp4"
   },
"Tamaulipas3" : {
    texto: "CNDH....al IMSS por caso de violencia obstétrica.",
    video: "assets/videos/Caso_10.mp4"
  },

   "Colima": {
     texto: "CNDH....al IMSS por caso de violencia obstétrica.",
     video: "assets/videos/Caso_6.mp4"
   },
"Sinaloa" : {
   texto: "Chiapas",
   video: "assets/videos/Caso_7.mp4"
 },

   "Coahuila1" : {
     texto: "CNDH....al IMSS por caso de violencia obstétrica.",
     video: "assets/videos/Caso_8.mp4"
   },
   "Chihuahua2" : {
     texto: "CNDH....al IMSS por caso de violencia obstétrica.",
     video: "assets/videos/Caso_9.mp4"
   },
   
   "CDMX" : {
     texto: "CNDH....al IMSS por caso de violencia obstétrica.",
     video: "assets/videos/Caso_11.mp4"
   },
 "Coahuila2": {
     texto: "CNDH....al IMSS por caso de violencia obstétrica.",
     video: "assets/videos/Caso_12.mp4"
   }
 
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
  // Overlay de fondo oscuro
  let overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999";

  // Modal
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.padding = "20px";
  modal.style.background = "white";
  modal.style.zIndex = "1000";
  modal.style.maxWidth = "600px";
  modal.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
  modal.style.textAlign = "center";
  modal.style.borderRadius = "16px"; // Bordes redondeados
  modal.style.transition = "opacity 0.3s ease-in-out";
  modal.style.opacity = "0"; // Inicialmente invisible

  // Mostrar con efecto de aparición
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);

  // Título
  let titulo = document.createElement("h2");
  titulo.textContent = nombre;

  // Descripción
  let descripcion = document.createElement("p");
  descripcion.textContent = info.texto;

  // Video
  let video = document.createElement("video");
  video.src = info.video;
  video.controls = true;
  video.autoplay = true;
  video.style.width = "100%";
  video.style.marginTop = "10px";
  video.style.borderRadius = "12px"; // Bordes redondeados del video

  // Botón de cerrar
  let closeButton = document.createElement("button");
  closeButton.innerText = "Cerrar";
  closeButton.style.marginTop = "10px";
  closeButton.style.padding = "10px 20px";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "8px";
  closeButton.style.backgroundColor = "#333";
  closeButton.style.color = "white";
  closeButton.style.cursor = "pointer";

  // Evento cerrar
  closeButton.onclick = () => {
    video.pause();
    modal.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    }, 300); // Coincide con la duración de la transición
  };

  // Agregar elementos
  modal.appendChild(titulo);
  modal.appendChild(descripcion);
  modal.appendChild(video);
  modal.appendChild(closeButton);

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}



function detectarEstadoPorCoordenadas(point) {
const tolerance = 0.3;

if (Math.abs(point.x - -0.7009258038610238) < tolerance && Math.abs(point.z - 1.4240945549538493) < tolerance) {
  return "CDMX"; // Coordenadas para CDMX
}

if (Math.abs(point.x - -2.5781790893159093) < tolerance && Math.abs(point.z - 1.298471124951381) < tolerance) {
  console.log("Estado detectado: Colima");
  return "Colima"; // Coordenadas para Colima
}

if (Math.abs(point.x - 1.8942448347094696) < tolerance && Math.abs(point.z - 2.64827199753406) < tolerance) {
  console.log("Estado detectado: Chiapas");
  return "Chiapas"; 
}

if (Math.abs(point.x - 0.33888635611213314) < tolerance && Math.abs(point.z - 1.4341463623126964) < tolerance) {
  console.log("Estado detectado: Veracruz");
  return "Veracruz"; 
}

if (Math.abs(point.x - -4.342694873943024) < tolerance && Math.abs(point.z - -3.719279246917718) < tolerance) {
  console.log("Estado detectado: Chihuahua_2");
  return "Chihuahua2"; 
}

if (Math.abs(point.x - -3.2579271766417266) < tolerance && Math.abs(point.z - -2.6977202232169457) < tolerance) {
  console.log("Estado detectado: Chihuahua 1");
  return "Chihuahua1"; 
}

if (Math.abs(point.x -  -0.22765651022056904) < tolerance && Math.abs(point.z - -0.4691419593569196) < tolerance) {
  console.log("Estado detectado: Tamaulipas");
  return "Tamauliapas"; 
}

if (Math.abs(point.x - -0.8254246493799218) < tolerance && Math.abs(point.z - -0.8068218964867508) < tolerance) {
  console.log("Estado detectado: Tamaulipas2");
  return "Tamauliapas2"; 
}

if (Math.abs(point.x - -0.37391378287684485) < tolerance && Math.abs(point.z - -1.811843538621835) < tolerance) {
  console.log("Estado detectado: Tamaulipas3");
  return "Tamauliapas3"; 
}

if (Math.abs(point.x - -3.7892863398474055) < tolerance && Math.abs(point.z - -1.1802714704492945) < tolerance) {
  console.log("Estado detectado: Sinaloa");
  return "Sinaloa"; 
}

if (Math.abs(point.x - -1.5403530538098897) < tolerance && Math.abs(point.z - -1.8037631799688345 ) < tolerance) {
  console.log("Estado detectado: Coahuila");
  return "Coahuila1"; 
}

if (Math.abs(point.x - -1.933498766022701) < tolerance && Math.abs(point.z - -2.8621781115412297) < tolerance) {
  console.log("Estado detectado: Coahuila");
  return "Coahuila2"; 
}
return null;
}

//
const images = document.querySelectorAll('.img');
  
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Solo se anima una vez
    }
  });
}, {
  threshold: 0.2 // Se activa cuando el 20% del elemento es visible
});

images.forEach(img => observer.observe(img));


