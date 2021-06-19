import * as THREE from "three";

export default class Tea {
    mesh: THREE.Mesh;

    constructor(scene: THREE.Scene, geometry: THREE.ShapeGeometry) {
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
    }
}
