import * as THREE from "three";

import WaterVert from "./glsl/water.vert";
import WaterFrag from "./glsl/water.frag";

export default class MaterialsList {
    cube = new THREE.MeshBasicMaterial({
        color: 0xfae893,
    });
    base = new THREE.MeshBasicMaterial({ alphaTest: 2 });
    water = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
        },
        vertexShader: WaterVert,
        fragmentShader: WaterFrag,
        depthWrite: false,
    });
    cup = new THREE.MeshBasicMaterial({
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

export function getTimeUniforms(materials: MaterialsList): THREE.IUniform[] {
    return [materials.water.uniforms.time];
}
