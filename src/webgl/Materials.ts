import * as THREE from "three";

import WaterVert from "./glsl/water.vert";
import WaterFrag from "./glsl/water.frag";

export default class Materials {
    cube = new THREE.MeshToonMaterial({
        color: 0xfae893,
    });
    base = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
    });
    water = new THREE.RawShaderMaterial({
        uniforms: {
            time: { value: 0 },
        },
        vertexShader: WaterVert,
        fragmentShader: WaterFrag,
        depthWrite: false,
    });
    cup = new THREE.MeshToonMaterial({
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

export function getTimeUniforms(materials: Materials): THREE.IUniform[] {
    return [materials.water.uniforms.time];
}
