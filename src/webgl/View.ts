import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Materials, { getTimeUniforms } from "./Materials";

export default class View {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    private timeUniforms: THREE.IUniform[];

    private loading: number;

    constructor(canvasElem: HTMLCanvasElement, debug: boolean) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElem,
            antialias: true,
        });

        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 2000);
        const angle = debug ? 0.0 : Math.random() * Math.PI * 2;
        this.camera.position.set(Math.cos(angle) * 4, 3, Math.sin(angle) * 4);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        // Orbit controls
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        if (!debug) {
            this.controls.enableDamping = true;
            this.controls.enablePan = false;
            this.controls.enableZoom = false;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.4;
            this.controls.maxPolarAngle = (Math.PI / 64) * 31;
            this.controls.minPolarAngle = Math.PI / 8;
        }
        this.controls.update();

        // Lighting
        this.scene.add(new THREE.AmbientLight(0xffffff, 1));

        this._loadScene();

        // Set initial sizes
        this.onWindowResize(window.innerWidth, window.innerHeight);
    }

    public onWindowResize(vpW: number, vpH: number): void {
        this.renderer.setSize(vpW, vpH);
        this.camera.aspect = vpW / vpH;
        this.camera.updateProjectionMatrix();
    }

    public update(time: number): void {
        this.controls.update();

        if (this.loading == 1) {
            for (const u of this.timeUniforms) {
                u.value = time;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    private _loadScene() {
        this.loading = 0;
        const loadingBar = document.getElementById("loading-bar");

        const materials = new Materials();
        this.timeUniforms = getTimeUniforms(materials);

        const loader = new GLTFLoader();
        loader.load(
            "media/view.glb",
            (gltf) => {
                for (const name in materials) {
                    const obj = gltf.scene.getObjectByName(name) as THREE.Mesh;
                    const material = materials[name];

                    this.scene.add(new THREE.Mesh(obj.geometry, material));
                }

                document.getElementById("webgl-canvas").classList.add("show");
                this.loading = 1;
            },
            (xhr) => {
                this.loading = xhr.loaded / xhr.total;
                console.log(`${this.loading * 100}% loaded`);
                loadingBar.style.width = `${this.loading * 200}px`;
            },
            (error) => {
                console.log("Loading failed");
                loadingBar.style.width = "0";
            }
        );
    }
}
