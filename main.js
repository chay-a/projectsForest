import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const texture = new THREE.TextureLoader().load("images/sky.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
scene.background = texture

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = document.getElementById('scene');
canvas.appendChild(renderer.domElement);
const light = new THREE.AmbientLight(0x404040, 50); // soft white light
scene.add(light);


const loader = new GLTFLoader();

let geometry = new THREE.BoxGeometry(20, 0.1, 20);
let material = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
let ground = new THREE.Mesh(geometry, material);
scene.add(ground);

const controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(15, 5, 10);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

if (localStorage.getItem("projects")) {
    let projects = JSON.parse(localStorage.getItem('projects'))
    projects.forEach(project => {
        loader.load(`images/${project.maturity}.glb`, function (gltf) {
            let content = gltf.scene
            scene.add(content);

            content.position.x = project.x
            content.position.z = project.z

        }, undefined, function (error) {

            console.error(error);

        });
    });
}



const addProjectSubmit = document.querySelector('#add-project input[type="submit"]')
addProjectSubmit.addEventListener('click', function (event) {
    event.preventDefault()
    const projectMaturity = document.querySelector("#add-project select")
    const projectMaturityValue = projectMaturity.options[projectMaturity.selectedIndex].value;
    loader.load(`images/${projectMaturityValue}.glb`, function (gltf) {
        let content = gltf.scene
        scene.add(content);

        // content.position.setX(0)
        let projects = [];
        if (localStorage.getItem("projects")) {
            projects = JSON.parse(localStorage.getItem('projects'))
            let x = getRandomInt(10)
            let z = getRandomInt(10)
            if (canBePlaced(projects, x, z)) {
                content.position.x = x
                content.position.z = z
            }
        } else {
            content.position.x = 1
            content.position.z = 1
        }
        const project = {
            title: document.querySelector("#add-project #title").value,
            maturity: projectMaturityValue,
            x: content.position.x,
            z: content.position.z
        }
        projects.push(project)
        localStorage.setItem("projects", JSON.stringify(projects))
    }, undefined, function (error) {

        console.error(error);

    });
    projectMaturity.selectedIndex = 0
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function canBePlaced(projects, x, z) {
    projects.forEach(project => {
        if (project.x == x && project.z == z) {
            return false
        }
    });
    return true
}