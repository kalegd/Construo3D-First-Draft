function getRadians(degrees) {
    return ((degrees % 360) / 180) * Math.PI;
}

function isColorHex(hex) {
    var re = /^0x[0-9A-Fa-f]{6}$/g;

    if(re.test(hex)) {
        return true;
    } else {
        return false;
    }
}

function numberToHexString(number) {
    str = number.toString(16);
    while(str.length < 6) {
        str = '0' + str;
    }
    return str;
}

function fullDispose(object3d) {
    object3d.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            if (node.geometry) {
                node.geometry.dispose();
            }

            if (node.material) {

                if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
                    node.material.materials.forEach(function (mtrl, idx) {
                        disposeMaterial(mtrl);
                    });
                }
                else {
                    disposeMaterial(node.material);
                }
            }
        }
    });
}

function disposeMaterial(material) {
    if (material.alphaMap) material.alphaMap.dispose();
    if (material.aoMap) material.aoMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.displacementMap) material.displacementMap.dispose();
    if (material.emissiveMap) material.emissiveMap.dispose();
    if (material.envMap) material.envMap.dispose();
    if (material.gradientMap) material.gradientMap.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.map) material.map.dispose();
    if (material.metalnessMap) material.metalnessMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.roughnessMap) material.roughnessMap.dispose();
    if (material.specularMap) material.specularMap.dispose();

    material.dispose();    // disposes any programs associated with the material
}
