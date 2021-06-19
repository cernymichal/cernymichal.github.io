import * as THREE from "three";

import vertShader from "./glsl/water.vert";
import fragShader from "./glsl/water.frag";
import { randInt } from "Utils";

export default class Water {
    mesh: THREE.Mesh;
    timeU: THREE.IUniform;

    constructor(scene: THREE.Scene, geometry: THREE.ShapeGeometry) {
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: { value: 0 },
            },
            vertexShader: vertShader,
            fragmentShader: fragShader,
        });
        this.timeU = material.uniforms.time;
        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
    }

    public update(secs: number): void {
        this.timeU.value = secs;
    }
}
