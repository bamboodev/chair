import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls;

// Initialize the scene, camera, and renderer
function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 2, 5);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(-5, 5, -5);
  scene.add(backLight);

  // Controls setup
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 2;
}

// Load the 3D model
function loadModel() {
  const loadingScreen = document.getElementById("loading");
  loadingScreen.style.display = "block";

  const loader = new GLTFLoader();

  loader.load(
    "./chair.glb",
    function (gltf) {
      // Center the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.x -= center.x;
      gltf.scene.position.y -= center.y;
      gltf.scene.position.z -= center.z;

      // Auto-adjust camera distance based on model size
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.z = maxDim * 2.5;
      controls.target.set(0, 0, 0);
      controls.update();

      scene.add(gltf.scene);
      loadingScreen.style.display = "none";
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total) * 100;
      if (percent === 100) {
        loadingScreen.textContent = "Processing...";
      } else {
        loadingScreen.textContent = `Loading: ${Math.round(percent)}%`;
      }
    },
    function (error) {
      console.error("An error occurred while loading the model:", error);
      loadingScreen.textContent =
        "Error loading model. Please check console for details.";
      loadingScreen.style.color = "red";
    },
  );
}

// Handle window resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Initialize everything and start the animation loop
init();
loadModel();
animate();

// Add window resize listener
window.addEventListener("resize", onWindowResize, false);
