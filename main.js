import * as THREE from 'three';

// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the DVD logo texture from the local file
const textureLoader = new THREE.TextureLoader();
const dvdTexture = textureLoader.load('DvD.png'); // Use the correct relative path

// Create a plane geometry for the DVD logo and apply the texture
const geometry = new THREE.PlaneGeometry(2, 1); // Adjust the size as necessary
const material = new THREE.MeshBasicMaterial({ map: dvdTexture });
const dvdObject = new THREE.Mesh(geometry, material);
scene.add(dvdObject);

// Set initial position, speed, and scale
dvdObject.position.set(0, 0, 0);
let velocity = new THREE.Vector3(0.05, 0.05, 0); // Speed of movement

camera.position.z = 5;

let bounceCount = 0;

// Function to detect screen collision and bounce
function checkBoundsAndBounce() {
    const halfObjectWidth = dvdObject.geometry.parameters.width / 2;
    const halfObjectHeight = dvdObject.geometry.parameters.height / 2;

    // Collision detection (left, right, top, bottom)
    if (dvdObject.position.x + halfObjectWidth > (window.innerWidth / 100) / 2 || 
        dvdObject.position.x - halfObjectWidth < -(window.innerWidth / 100) / 2) {
        velocity.x = -velocity.x;  // Reverse horizontal direction
        shrinkOnCollision();
    }
    if (dvdObject.position.y + halfObjectHeight > (window.innerHeight / 100) / 2 || 
        dvdObject.position.y - halfObjectHeight < -(window.innerHeight / 100) / 2) {
        velocity.y = -velocity.y;  // Reverse vertical direction
        shrinkOnCollision();
    }
}

// Function to shrink on collision
function shrinkOnCollision() {
    // Shrink the object with each bounce
    dvdObject.scale.multiplyScalar(0.9);

    // Increase bounce count and remove the object after 5-8 bounces
    bounceCount++;
    if (bounceCount >= 5 && bounceCount <= 8) {
        scene.remove(dvdObject);
        renderer.setAnimationLoop(null); // Stop the animation loop
    }
}

// Animation loop
function animate() {
    // Move the object
    dvdObject.position.add(velocity);

    // Check for screen bounds and bounce
    checkBoundsAndBounce();

    // Render the scene
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
