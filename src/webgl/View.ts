import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Water from "./Water";
import Steam from "./Steam";
import Cup from "./Cup";
import Cube from "./Cube";
import Tea from "./Tea";

export default class View {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    private water: Water;
    private steam: Steam;

    private loading: number;

    constructor(canvasElem: HTMLCanvasElement) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElem,
            antialias: true,
        });

        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 2000);
        const angle =
            process.env.NODE_ENV === "production"
                ? Math.random() * Math.PI * 2
                : 0.0;
        this.camera.position.set(Math.cos(angle) * 4, 3, Math.sin(angle) * 4);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        // Orbit controls
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        if (process.env.NODE_ENV === "production") {
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

        if (this.loading == 100) {
            this.water.update(secs);
            this.steam.update(secs);
        }

        this.renderer.render(this.scene, this.camera);
    }

    private _loadScene() {
        this.loading = 0;

        const loader = new GLTFLoader();
        loader.load(
            "media/scene.glb",
            (gltf) => {
                const cube = gltf.scene.getObjectByName("cube") as THREE.Mesh;
                const water = gltf.scene.getObjectByName("water") as THREE.Mesh;
                const cup = gltf.scene.getObjectByName("cup") as THREE.Mesh;
                const tea = gltf.scene.getObjectByName("tea") as THREE.Mesh;
                const steam = gltf.scene.getObjectByName("steam");

                new Cube(this.scene, cube.geometry);
                new Cup(this.scene, cup.geometry);
                new Tea(this.scene, tea.geometry);

                this.water = new Water(this.scene, water.geometry);
                this.steam = new Steam(this.scene, steam.position);

                this.loading = 100;
            },
            (xhr) => {
                this.loading = (xhr.loaded / xhr.total) * 100;
                console.log(this.loading + "% loaded");
            },
            (error) => {
                console.log("Loading scene failed");
            }
        );
    }
}
