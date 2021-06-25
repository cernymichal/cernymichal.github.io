import * as THREE from "three";

export default class Base {
    mesh: THREE.Mesh;

    constructor(scene: THREE.Scene, geometry: THREE.ShapeGeometry) {
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
    }
}
