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
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const waterFragmentShader = `
uniform float time;

void main() {
    gl_FragColor = vec4(0.0, 0.0, (sin(time / 1000.0) + 1.0) / 2.0, 1.0);
}
`;

class MaterialsList {
    cube = new THREE.MeshBasicMaterial({
        color: 0xfae893,
    });
    base = new THREE.MeshBasicMaterial({ alphaTest: 2 });
    water = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
        },
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        depthWrite: false,
    });
    cup = new THREE.MeshBasicMaterial({
        color: 0xfac8ac,
    });
    tea = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
    });
    steam = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
    });
}

function getTimeUniforms(materials) {
    return [materials.water.uniforms.time];
}

class MainView {
    constructor(canvas) {
        toggleCanvas(false);

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: "high-performance",
        });

        // camera
        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 2000);
        const angle = Math.random() * Math.PI * 2;
        this.camera.position.set(Math.cos(angle) * 4, 3, Math.sin(angle) * 4);

        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        // materials init
        const materials = new MaterialsList();
        this.timeUniforms = getTimeUniforms(materials);

        // start loading main-view.glb and apply materials
        const loader = new GLTFLoader();
        loader.load(
            "assets/main-view.glb",
            (gltf) => {
                for (const name in materials) {
                    const obj = gltf.scene.getObjectByName(name);
                    const material = materials[name];

                    this.scene.add(new THREE.Mesh(obj.geometry, material));
                }

                toggleCanvas(true);
            },
            (xhr) => {},
            (error) => {
                console.log(`Loading failed\n${error.message}`);
            }
        );

        // orbit controls
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.4;
        this.controls.maxPolarAngle = (Math.PI / 64) * 31;
        this.controls.minPolarAngle = Math.PI / 8;

        this.controls.update();

        // lighting
        this.scene.add(new THREE.AmbientLight(0xffffff, 1));

        // initial size
        this.onWindowResize(window.innerWidth, window.innerHeight);
    }

    onWindowResize(vpW, vpH) {
        this.renderer.setSize(vpW, vpH);
        this.camera.aspect = vpW / vpH;
        this.camera.updateProjectionMatrix();
    }

    update(time) {
        this.controls.update();

        for (const u of this.timeUniforms) {
            u.value = time;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// initialize view
const view = new MainView(canvas);

// main loop
const update = (time) => {
    view.update(time);
    requestAnimationFrame(update);
};

// resize renderer in view
window.addEventListener("resize", () => {
    view.onWindowResize(window.innerWidth, window.innerHeight);
});

update(0);
