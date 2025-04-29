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

renderer.setSize(1750, window.innerHeight);
renderer.setClearColor(0x00491000, 0.01);
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
loader.load('assets/Mapabueno.glb', (gltf) => {
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
  "Ocosingo, Chiapas" : {
   texto: '<strong>Título</strong>: RECOMENDACIÓN No. 47. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS A LA PROTECCIÓN DE LA SALUD Y A LA VIDA POR VIOLENCIA OBSTÉTRICA, EN AGRAVIO DE V1 Y V2.<br><strong> Estado </strong>: Chiapas <br>  <strong>Fecha de emisión:</strong>  30 de septiembre de 2016  <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>' ,
   video: "assets/videos/Caso_1.mp4"
 },
    "Hospital rural, Zongolica, Veracruz" : {
   texto: '<strong>Título: </strong> RECOMENDACIÓN NO. 5/2025. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA SALUD MATERNA, A UNA VIDA LIBRE DE VIOLENCIA DE TIPO OBSTÉTRICA Y AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD DE V1 PERSONA INDÍGENA NÁHUATL, ASÍ COMO AL PROYECTO DE VIDA DE V1, QVI1, VI5 Y VI6, Y A LA INTEGRIDAD DE VI2, VI3 Y VI4 EN EL HOSPITAL RURAL ZONGOLICA DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL EN ZONGOLICA, VERACRUZ.<br><strong> Estado </strong>: Veracruz <br>  <strong>Fecha de emisión:</strong>   31 de enero de 2025 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2025-03/REC_2025_005.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
   video: "assets/videos/Caso_2.mp4"
 },
   
    "Ciudad Madero, Tamaulipas": {
     texto: '<strong>Título: </strong>RECOMENDACIÓN NO. 212 /2024. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA PROTECCIÓN DE LA SALUD Y A UNA VIDA LIBRE DE VIOLENCIA EN SU MODALIDAD OBSTÉTRICA EN AGRAVIO DE V1; A LA SALUD, A LA VIDA Y AL PRINCIPIO DEL INTERÉS SUPERIOR DE LA NIÑEZ EN AGRAVIO DE V2; ASÍ COMO AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD EN AGRAVIO Y AFECTACIÓN AL PROYECTO DE VIDA DE QVI, V1, VI1 Y VI2, POR PERSONAL MÉDICO EN LA UNIDAD DE MEDICINA FAMILIAR NO. 77 Y EN EL HOSPITAL GENERAL REGIONAL NO. 6, AMBOS DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL, EN CIUDAD MADERO, TAMAULIPAS.<br><strong> Estado </strong>: Tamaulipas <br>  <strong>Fecha de emisión:</strong>   23 septiembre de 2024 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2024-09/REC_2024_212.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
     video: "assets/videos/Caso_4.mp4"
   },
    "Reynosa, Tamaulipas": {
     texto: '<strong>Título: </strong>RECOMENDACIÓN NO. 204/2024. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A UNA VIDA LIBRE DE VIOLENCIA OBSTÉTRICA, A LA PROTECCIÓN DE LA SALUD, A LA VIDA Y AL TRATO DIGNO EN AGRAVIO DE V; ASÍ COMO, AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD EN AGRAVIO DE QVI Y VI, ATRIBUIBLE AL PERSONAL MÉDICO DEL HOSPITAL GENERAL REGIONAL NO. 270 DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL EN REYNOSA, TAMAULIPAS.<br><strong> Estado </strong>: Tamaulipas <br>  <strong>Fecha de emisión:</strong>    30 de agosto de 2024 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2024-09/REC_2024_204.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
     video: "assets/videos/Caso_5.mp4"
   },
    "Matamoros, Tamaulipas" : {
    texto: '<strong>Título: </strong>RECOMENDACIÓN NO. 260 /2024 SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA PROTECCIÓN DE LA SALUD Y A UNA VIDA LIBRE DE VIOLENCIA EN SU MODALIDAD GINECO-OBSTÉTRICA EN AGRAVIO DE QV; ASÍ COMO, AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD EN AGRAVIO DE QV, VI1 Y VI2, ATRIBUIBLE AL PERSONAL MÉDICO DEL HOSPITAL GENERAL DE ZONA NO. 13 DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL EN MATAMOROS, TAMAULIPAS.<br><strong> Estado </strong>: Tamaulipas<br>  <strong>Fecha de emisión:</strong>    20 de noviembre de 2024<strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2024-11/REC_2024_260.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
    video: "assets/videos/Caso_10.mp4"
  },

    "Villa de Álvarez, Colima": {
     texto: '<strong>Título: </strong>RECOMENDACIÓN No. 280/2024. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA PROTECCIÓN DE LA SALUD; ASÍ COMO A UNA VIDA LIBRE DE VIOLENCIA EN SU MODALIDAD GINECO OBSTÉTRICA EN AGRAVIO DE V1; Y AL INTERÉS SUPERIOR DE LA NIÑEZ Y A LA PROTECCIÓN A LA VIDA DE V2; ASÍ COMO, AL DERECHO DE ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD EN AGRAVIO DE V1, QVI Y VI1, POR PERSONAL MÉDICO EN EL HOSPITAL GENERAL DE ZONA NO. 1 “VILLA DE ÁLVAREZ", DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL, EN EL MUNICIPIO VILLA DE ÁLVAREZ, COLIMA.<br><strong> Estado </strong>: Colima <br>  <strong>Fecha de emisión:</strong>    18 de diciembre  de 2024 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2025-01/REC_2024_280.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
     video: "assets/videos/Caso_6.mp4"
   },
    "Hospital rural No.12, Zongolica, Veracruz" : {
   texto: '<strong>Título: </strong>RECOMENDACIÓN NO. 27/2025. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA PROTECCIÓN DE LA SALUD, Y A UNA VIDA LIBRE DE VIOLENCIA OBSTÉTRICA DE QV, ASÍ COMO AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD EN AGRAVIO DE QV Y VI, ATRIBUIBLES A PERSONAS SERVIDORAS PÚBLICAS DEL HOSPITAL RURAL NO. 12 DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL EN ZONGOLICA VERACRUZ.<br><strong> Estado </strong>: Veracruz <br>  <strong>Fecha de emisión:</strong>    28 de febrero de 2025 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/fhttps://www.cndh.org.mx/sites/default/files/documentos/2025-03/REC_2025_027.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
   video: "assets/videos/Caso_7.mp4"
 },

    "Hospital General, Torreón, Coahuila" : {
     texto: '<strong>Título: </strong>RECOMENDACIÓN NO. 19/2025. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA SALUD MATERNA, A UNA VIDA LIBRE DE VIOLENCIA DE TIPO OBSTÉTRICA, AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD EN AGRAVIO DE V1, ASÍ COMO AL PROYECTO DE VIDA DE V1, VI1 Y VI2, ATRIBUIBLES A PERSONAL DEL HOSPITAL RURAL NÚMERO 79 DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL EN MATAMOROS, COAHUILA Y DEL HOSPITAL GENERAL DE LA SECRETARÍA DE SALUD DEL ESTADO DE COAHUILA, EN TORREÓN, COAHUILA. <br><strong> Estado </strong>: Coahuila <br>  <strong>Fecha de emisión:</strong>    28 de febrero de 2025 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2025-03/REC_2025_019.pdf" target="_blank">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
     video: "assets/videos/Caso_8.mp4"
   },

    "Ciudad Juárez, Chihuahua" : {
   texto: '<strong>Título: </strong> RECOMENDACIÓN NO. 177 /2024. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA PROTECCIÓN DE LA SALUD MATERNA, A UNA VIDA LIBRE DE VIOLENCIA OBSTÉTRICA, Y AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD DE QV1; AL INTERÉS SUPERIOR DE LA NIÑEZ Y A LA PROTECCIÓN DE LA SALUD DE V2, ASÍ COMO AL PROYECTO DE VIDA QV1 Y V2 EN HOSPITAL GENERAL REGIONAL NO. 66 DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL EN CIUDAD JUÁREZ, CHIHUAHUA..<br><strong> Estado </strong>: Chihuahua <br>  <strong>Fecha de emisión:</strong>   17 de julio de 2024 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2024-08/REC_2024_177.pdf">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
   video: "assets/videos/Caso_3.mp4"
 },
    "San Francisco del Oro, Chihuahua" : {
     texto: '<strong>Título: </strong> RECOMENDACIÓN NO. 18/2025. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA SALUD MATERNA, A UNA VIDA LIBRE DE VIOLENCIA OBSTÉTRICA, EN AGRAVIO DE QV1, ASÍ COMO DAÑO AL PROYECTO DE VIDA DE QV1, VI1, VI2 Y VI3 EN LA UNIDAD DE MEDICINA FAMILIAR NO. 09 DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL, EN SAN FRANCISCO DEL ORO, CHIHUAHUA.<br><strong> Estado </strong>: Chihuahua <br>  <strong>Fecha de emisión:</strong>   28 de febrero de 2025 <strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2025-03/REC_2025_018_0.pdf">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
     video: "assets/videos/Caso_9.mp4"
   },
   
    "Ciudad de México" : {
     texto: '<strong>Título: </strong> RECOMENDACIÓN NO. 178/2024. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA PROTECCIÓN DE LA SALUD MATERNA, A UNA VIDA LIBRE DE VIOLENCIA EN SU MODALIDAD DE VIOLENCIA OBSTÉTRICA Y AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD DE QV1; ASÍ COMO AL PROYECTO DE VIDA DE QV1, VI1 Y VI2 EN EL HOSPITAL DE GINECO OBSTETRICIA NO. 4 “LUIS CASTELAZO AYALA”, DE LA UNIDAD MÉDICA DE ALTA ESPECIALIDAD DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL EN LA CIUDAD DE MÉXICO.<br><strong> Estado </strong>: Ciudad de México<br>  <strong>Fecha de emisión:</strong>   17 de julio de 2024<strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2024-08/REC_2024_178.pdf">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
     video: "assets/videos/Caso_11.mp4"
   },
    "Hospitales Generales de Zona NO. 6 y 16, Torreón, Coahuila": {
     texto: '<strong>Título: </strong> RECOMENDACIÓN No. 241/ 2024. SOBRE EL CASO DE VIOLACIONES A LOS DERECHOS HUMANOS A LA PROTECCIÓN DE LA SALUD, AL TRATO DIGNO, ASÍ COMO UNA VIDA LIBRE DE VIOLENCIA EN SU MODALIDAD OBSTÉTRICA EN AGRAVIO DE V; ASÍ COMO, AL ACCESO A LA INFORMACIÓN EN MATERIA DE SALUD EN AGRAVIO DE QV, VI1 Y VI2, POR PERSONAL MÉDICO EN LOS HOSPITALES GENERALES DE ZONA NÚMERO 6 Y 16 DEL INSTITUTO MEXICANO DEL SEGURO SOCIAL, AMBOS EN COAHUILA.<br><strong> Estado </strong>: Coahuila<br>  <strong>Fecha de emisión:</strong>   31 de octubre de 2024<strong> <br>*Basado en documentación de la Comisión Nacional de los Derechos Humanos (CNDH).</strong> <br> Documento de referencia: <br>  <a href="https://www.cndh.org.mx/sites/default/files/documentos/2024-11/REC_2024_241.pdf">https://www.cndh.org.mx/sites/default/files/doc/Recomendaciones/2016/Rec_2016_047.pdf</a>',
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
  modal.style.textAlign = "justify";
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
  let descripcion = document.createElement("div");
  descripcion.innerHTML = info.texto;

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

if (Math.abs(point.x - -0.8218981406780066) < tolerance && Math.abs(point.z - -0.4209569886814517) < tolerance) {
  return "Ciudad de México"; // Coordenadas para CDMX
}

if (Math.abs(point.x - -2.9734875056153958) < tolerance && Math.abs(point.z - -0.2743955263402391) < tolerance) {
  console.log("Estado detectado: Villa de Álvarez, Colima");
  return "Villa de Álvarez, Colima"; // Coordenadas para Colima
}

if (Math.abs(point.x -  2.884867830792899) < tolerance && Math.abs(point.z - 1.2727932623132556) < tolerance) {
  console.log("Estado detectado: Ocosingo, Chiapas");
  return "Ocosingo, Chiapas"; 
}

if (Math.abs(point.x - 0.6697062116845324) < tolerance && Math.abs(point.z - 1.3582407595541253) < tolerance) {
  console.log("Estado detectado:Hospital rural, Zongolica, Veracruz.");
  return "Hospital rural, Zongolica, Veracruz"; 
}

if (Math.abs(point.x - -2.7001512738816964) < tolerance && Math.abs(point.z - 0.04817296338204535) < tolerance) {
  console.log("Estado detectado:San Francisco del Oro, Chihuahua");
  return "San Francisco del Oro, Chihuahua"; 
}

if (Math.abs(point.x - -3.5805830746200726) < tolerance && Math.abs(point.z - -4.08082020226516) < tolerance) {
  console.log("Ciudad Juárez, Chihuahua");
  return "Ciudad Juárez, Chihuahua"; 
}


if (Math.abs(point.x - -0.1941757189842086) < tolerance && Math.abs(point.z - 1.4444257558049776) < tolerance) {
  console.log("Estado detectado:Ciudad Madero, Tamaulipas");
  return "Ciudad Madero, Tamaulipas"; 
}

if (Math.abs(point.x - -0.7857313542936664) < tolerance && Math.abs(point.z - -2.455557021329403 ) < tolerance) {
  console.log("Estado detectado: Reynosa, Tamaulipas");
  return "Reynosa, Tamaulipas"; 
}

if (Math.abs(point.x - 0.03863472704214432) < tolerance && Math.abs(point.z - -1.6613196450921617) < tolerance) {
  console.log("Estado detectado: Matamoros, Tamaulipas");
  return "Matamoros, Tamaulipas."; 
}

if (Math.abs(point.x - 0.24109094542950826) < tolerance && Math.abs(point.z - 1.5393501362664965) < tolerance) {
  console.log("Estado detectado: Hospital rural No.12, Zongolica, Veracruz");
  return "Hospital rural No.12, Zongolica, Veracruz"; 
}

if (Math.abs(point.x -  -1.7551767983785342) < tolerance && Math.abs(point.z - -2.0335167200004047) < tolerance) {
  console.log("Estado detectado:Hospitales Generales de Zona NO. 6 y 16, Torreón, Coahuila");
  return "Hospitales Generales de Zona NO. 6 y 16, Torreón, Coahuila"; 
}

if (Math.abs(point.x - -2.244481563060835) < tolerance && Math.abs(point.z - -1.5787312166864003) < tolerance) {
  console.log("Hospital General, Torreón, Coahuila");
  return "Hospital General, Torreón, Coahuila"; 
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


