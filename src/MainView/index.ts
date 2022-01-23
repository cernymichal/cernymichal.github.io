import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

import { updateLoading, toggleCanvas } from "../App";
import MaterialsList, { getTimeUniforms } from "./Materials";

export default class MainView {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    private timeUniforms: THREE.IUniform[];

    constructor(canvas: HTMLCanvasElement, debug: boolean) {
        // reset loading
        updateLoading(0);
        toggleCanvas(false);

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: "high-performance",
        });

        // camera
        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 2000);
        const angle = debug ? 0.0 : Math.random() * Math.PI * 2;
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
                    const obj = gltf.scene.getObjectByName(name) as THREE.Mesh;
                    const material = materials[name];

                    this.scene.add(new THREE.Mesh(obj.geometry, material));
                }

                updateLoading(1);
                toggleCanvas(true);
            },
            (xhr) => {
                updateLoading(xhr.loaded / xhr.total);
            },
            (error) => {
                console.log(`Loading failed\n${error.message}`);
                updateLoading(0);
            }
        );

        // orbit controls
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

        // lighting
        this.scene.add(new THREE.AmbientLight(0xffffff, 1));

        // initial size
        this.onWindowResize(window.innerWidth, window.innerHeight);
    }

    public onWindowResize(vpW: number, vpH: number): void {
        this.renderer.setSize(vpW, vpH);
        this.camera.aspect = vpW / vpH;
        this.camera.updateProjectionMatrix();
    }

    public update(time: number): void {
        this.controls.update();

        for (const u of this.timeUniforms) {
            u.value = time;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
