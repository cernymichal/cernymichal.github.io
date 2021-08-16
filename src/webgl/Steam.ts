import * as THREE from "three";

export default class Steam {
    mesh: THREE.Mesh;

    constructor(scene: THREE.Scene, position: THREE.Vector3) {
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y, position.z);
        scene.add(this.mesh);
    }

    public update(secs: number): void {}
}
