class Logo {
    constructor(logoRadius, x, y, z) {
        this._cubeMesh;
        this._sphereMesh;
        this._pivotPoint = new THREE.Object3D();

        this._pivotPoint.position.x = x;
        this._pivotPoint.position.y = y;
        this._pivotPoint.position.z = z;

        this._createMeshes(logoRadius);
    }

    _createMeshes(logoRadius, x, y, z) {
        var sphereRadius = logoRadius;
        var sphereWidthSegments = 16;
        var sphereHeightSegments = 16;

        var sphereGeometry = new THREE.SphereBufferGeometry(
                sphereRadius,
                sphereWidthSegments,
                sphereHeightSegments);
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
        this._sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        var cubeGeometry = new THREE.BoxBufferGeometry( 1.5 * logoRadius, 1.5 * logoRadius, 1.5  * logoRadius);
        var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00FF00 } );
        this._cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
        this._pivotPoint.add(this._cubeMesh);
        this._pivotPoint.add(this._sphereMesh);
    }

    update(timeDelta, rotX, rotY, rotZ) {
        this._pivotPoint.rotation.x += rotX * timeDelta;
        this._pivotPoint.rotation.y += rotY * timeDelta;
        this._pivotPoint.rotation.z += rotZ * timeDelta;
    }
}
