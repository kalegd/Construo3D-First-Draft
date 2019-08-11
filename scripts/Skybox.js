class Skybox {
    constructor(skyboxLength, skyboxName, fileExtension) {
        this._skyboxMesh;
        this._skyboxLight;
        this._pivotPoint = new THREE.Object3D();

        this._createMeshes(skyboxLength, skyboxName, fileExtension);
        //this._createLight(skyboxLength);
    }

    _createMeshes(skyboxLength, skyboxName, fileExtension) {
        var skyboxGeometry = new THREE.CubeGeometry( skyboxLength, skyboxLength, skyboxLength );
        var skyboxMaterials = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/right_" + skyboxName + fileExtension ), side: THREE.BackSide }), //right side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/left_" + skyboxName + fileExtension ), side: THREE.BackSide }), //left side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/up_" + skyboxName + fileExtension ), side: THREE.BackSide }), //up side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/down_" + skyboxName + fileExtension ), side: THREE.BackSide }), //down side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/front_" + skyboxName + fileExtension ), side: THREE.BackSide }), //front side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/back_" + skyboxName + fileExtension ), side: THREE.BackSide }) //back side
        ];
        this._skyboxMesh = new THREE.Mesh( skyboxGeometry, skyboxMaterials );
    }

    changeMaterial(skyboxName, fileExtension) {
        let oldMaterials = this._skyboxMesh.material;
        var newMaterials = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/right_" + skyboxName + fileExtension ), side: THREE.BackSide }), //right side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/left_" + skyboxName + fileExtension ), side: THREE.BackSide }), //left side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/up_" + skyboxName + fileExtension ), side: THREE.BackSide }), //up side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/down_" + skyboxName + fileExtension ), side: THREE.BackSide }), //down side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/front_" + skyboxName + fileExtension ), side: THREE.BackSide }), //front side
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "images/skyboxes/" + skyboxName + "/back_" + skyboxName + fileExtension ), side: THREE.BackSide }) //back side
        ];
        this._skyboxMesh.material = newMaterials;
        for(var i = 0; i < oldMaterials.length; i++) {
            oldMaterials[i].map.dispose();
            oldMaterials[i].dispose();
        }
    }

    //_createLight(skyboxLength) {
    //    this._skyboxLight = new THREE.PointLight(0xFFFFFF);
    //    // set its position
    //    this._skyboxLight.translateX(skyboxLength * 67 / 300);
    //    this._skyboxLight.translateY(skyboxLength * 9 / 300);
    //    this._skyboxLight.translateZ(-1 * skyboxLength);
    //}

    addToScene(scene) {
        scene.add(this._pivotPoint);
        this._pivotPoint.add(this._skyboxMesh);
        //this._pivotPoint.add(this._skyboxLight);
    }

    update(timeDelta, rotX, rotY, rotZ) {
        this._pivotPoint.rotateX(rotX * timeDelta);
        this._pivotPoint.rotateY(rotY * timeDelta);
        this._pivotPoint.rotateZ(rotZ * timeDelta);
    }

    setRotationX(rot) {
        this._pivotPoint.rotation.x = rot;
    }

    setRotationY(rot) {
        this._pivotPoint.rotation.y = rot;
    
    }
    setRotationZ(rot) {
        this._pivotPoint.rotation.z = rot;
    }
}
