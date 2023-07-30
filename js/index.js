import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.getElementById("main-canvas");

const toggleCanvas = (show) => {
    if (show && !canvas.classList.contains("canvas-show"))
        canvas.classList.add("canvas-show");
    else if (!show && canvas.classList.contains("canvas-show"))
        canvas.classList.remove("canvas-show");
};

const waterVertexShader = `
varying vec4 v_world_position;

void main() {
    v_world_position = modelMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const waterFragmentShader = `
varying vec4 v_world_position;

uniform float u_time;

void main() {
    vec3 color = vec3(0.15, 0.35, 0.8);

    if (length(v_world_position.xz) > 1.7)
        discard;

    gl_FragColor = vec4(color, 0.7);
}
`;

class MaterialsList {
    top = new THREE.MeshBasicMaterial({
        color: 0xfae893,
    });
    base = this.top.clone();
    water = new THREE.ShaderMaterial({
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        transparent: true,
    });
    cup = new THREE.MeshBasicMaterial({
        color: 0xfac8ac,
    });
    tea = new THREE.MeshBasicMaterial({
        color: 0x110000,
        transparent: true,
        opacity: 0.5,
    });
    steam = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
    });
}

const standard_uniforms = {
    u_time: new THREE.Uniform(0.0),
    u_resolution: new THREE.Uniform(new THREE.Vector2()),
};

toggleCanvas(false);

let renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

// camera
let camera = new THREE.PerspectiveCamera(40, 1, 1, 2000);
const angle = Math.random() * Math.PI * 2;
camera.position.set(Math.cos(angle) * 4, 3, Math.sin(angle) * 4);

// scene
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x101010);
scene.fog = new THREE.FogExp2(0x101010, 0.06);

// materials init
const materials = new MaterialsList();

// start loading pond.glb and apply materials
const loader = new GLTFLoader();
loader.load(
    "assets/pond.glb",
    (gltf) => {
        for (const name in materials) {
            const obj = gltf.scene.getObjectByName(name);
            if (!obj) continue;

            obj.material = materials[name];
            obj.material.uniforms = standard_uniforms;

            scene.add(obj);
        }

        const steam = scene.getObjectByName("steam");
        const tea = scene.getObjectByName("tea");
        const water = scene.getObjectByName("water");
        const base = scene.getObjectByName("base");

        water.renderOrder = 0;
        tea.renderOrder = 1;
        steam.renderOrder = 2;

        const waterStencil = water.clone();
        waterStencil.material = water.material.clone();
        waterStencil.material.transparent = false;
        waterStencil.material.colorWrite = false;
        waterStencil.material.depthWrite = false;
        waterStencil.material.stencilWrite = true;
        waterStencil.material.stencilRef = 1;
        waterStencil.material.stencilFunc = THREE.AlwaysStencilFunc;
        waterStencil.material.stencilZPass = THREE.ReplaceStencilOp;
        waterStencil.renderOrder = 0;

        scene.add(waterStencil);

        base.material.stencilWrite = true;
        base.material.stencilRef = 1;
        base.material.stencilFunc = THREE.EqualStencilFunc;
        base.renderOrder = 1;

        toggleCanvas(true);
    },
    (xhr) => {},
    (error) => {
        console.log(`Loading failed\n${error.message}`);
    }
);

// orbit controls
let controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;
controls.maxPolarAngle = (Math.PI / 64) * 31;
controls.minPolarAngle = Math.PI / 8;

controls.update();

// lighting
scene.add(new THREE.AmbientLight(0xffffff, 1));

const clock = new THREE.Clock();

const render = () => {
    controls.update();

    standard_uniforms.u_time.value = clock.getElapsedTime();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

const resizeCanvas = (viewportWidth, viewportHeight) => {
    renderer.setSize(viewportWidth, viewportHeight);
    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();

    standard_uniforms.u_resolution.value.x = viewportWidth;
    standard_uniforms.u_resolution.value.y = viewportHeight;
};

window.addEventListener("resize", () => {
    resizeCanvas(window.innerWidth, window.innerHeight);
});

resizeCanvas(window.innerWidth, window.innerHeight);
render();
