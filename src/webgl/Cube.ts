import * as THREE from "three";

export default class Cube {
    mesh: THREE.Mesh;

    constructor(scene: THREE.Scene, geometry: THREE.ShapeGeometry) {
        const material = new THREE.MeshToonMaterial({
            color: 0xfae893,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
    }
}
