import * as THREE from "three";

import CANNON from "cannon";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Physics material
const material = new CANNON.Material();
const contact = new CANNON.ContactMaterial(material, material, {
  restitution: 0.7,
});
world.addContactMaterial(contact);

// Sphere body
const shape = new CANNON.Sphere(0.5);
const body = new CANNON.Body({
  mass: 1,
  shape,
  position: new CANNON.Vec3(0, 3, 0),
});
world.addBody(body);


const sphere2shape = new CANNON.Sphere(0.5);
const sphere2body = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(2, 5, 0),
});
sphere2body.addShape(sphere2shape);
world.addBody(sphere2body);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ mass: 0 });
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// Visual sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(.55, 32, 32),
  new THREE.MeshStandardMaterial({ color: "orange" })
);
scene.add(sphere);

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.55, 32, 32),
  new THREE.MeshStandardMaterial({ color: "red" })
);
scene.add(sphere2);

// Floor mesh
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: "#888" })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  100
);
camera.position.set(3, 3, 5);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);

const clock = new THREE.Clock();

// Press keys to apply force
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp")
    body.applyForce(new CANNON.Vec3(0, 0, -10), body.position);
  if (event.code === "ArrowDown")
    body.applyForce(new CANNON.Vec3(0, 0, 10), body.position);
  if (event.code === "ArrowLeft")
    body.applyForce(new CANNON.Vec3(-10, 0, 0), body.position);
  if (event.code === "ArrowRight")
    body.applyForce(new CANNON.Vec3(10, 0, 0), body.position);
  if (event.code === "Space")
    body.applyForce(new CANNON.Vec3(0, 50, 0), body.position);
});


window.addEventListener("keydown", (event) => {
  if (event.code=="KeyA")
    sphere2body.applyForce(new CANNON.Vec3(0, 0, 10), sphere2body.position);
    console.log(event.code)
  if (event.code === "s")
    sphere2body.applyForce(new CANNON.Vec3(0, 0, -10), sphere2body.position);
  if (event.code === "ArrowLeft")
    sphere2body.applyForce(new CANNON.Vec3(-10, 0, 0), sphere2body.position);
  if (event.code === "ArrowRight")
    sphere2body.applyForce(new CANNON.Vec3(10, 0, 0), sphere2body.position);
  if (event.code === "Space")
    sphere2body.applyForce(new CANNON.Vec3(0, 50, 0), sphere2body.position);
});

function animate() {
  const dt = clock.getDelta();
  world.step(1 / 60, dt);
  sphere.position.copy(body.position);
  sphere.quaternion.copy(body.quaternion);


  sphere2.position.copy(sphere2body.position);
  sphere2.quaternion.copy(sphere2body.quaternion);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
