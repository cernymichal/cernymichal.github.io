import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Water from "./Water";
import Steam from "./Steam";
import Cup from "./Cup";
import Cube from "./Cube";
import Tea from "./Tea";
import Base from "./Base";

export default class View {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    private water: Water;
    private steam: Steam;

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

    public update(secs: number): void {
        this.controls.update();

        if (this.loading == 1) {
            this.water.update(secs);
            this.steam.update(secs);
        }

        this.renderer.render(this.scene, this.camera);
    }

    private _loadScene() {
        this.loading = 0;
        const loadingBar = document.getElementById("loading-bar");

        const loader = new GLTFLoader();
        loader.load(
            "media/scene.glb",
            (gltf) => {
                const cube = gltf.scene.getObjectByName("cube") as THREE.Mesh;
                const base = gltf.scene.getObjectByName("base") as THREE.Mesh;
                const water = gltf.scene.getObjectByName("water") as THREE.Mesh;
                const cup = gltf.scene.getObjectByName("cup") as THREE.Mesh;
                const tea = gltf.scene.getObjectByName("tea") as THREE.Mesh;
                const steam = gltf.scene.getObjectByName("steam");

                new Cube(this.scene, cube.geometry);
                new Base(this.scene, base.geometry);
                new Cup(this.scene, cup.geometry);
                new Tea(this.scene, tea.geometry);

                this.water = new Water(this.scene, water.geometry);
                this.steam = new Steam(this.scene, steam.position);

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
