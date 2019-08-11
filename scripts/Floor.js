class Floor {
    constructor(width, height, textureName, fileExtension) {
        this._width = width;
        this._height = height;
        this._textureName = textureName;
        this._fileExtension = fileExtension;
        this._floorMesh;
        this._pivotPoint = new THREE.Object3D();

        this._createMeshes();
    }


    _createMeshes() {
        var floorGeometry = new THREE.PlaneBufferGeometry(this._width, this._height);
        var floorTexture = new THREE.TextureLoader().load("images/floors/" + this._textureName + this._fileExtension);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set( this._width / 10 , this._height / 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
        this._floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
        this._floorMesh.rotateX(-1 * Math.PI / 2);
    }

    _updateGeometry() {
        let oldGeometry = this._floorMesh.geometry;
        this._floorMesh.geometry = new THREE.PlaneBufferGeometry(this._width, this._height);
        oldGeometry.dispose();
        this.updateTexture(this._textureName, this._fileExtension);
    }

    updateTexture(textureName, fileExtension) {
        this._textureName = textureName;
        this._fileExtension = fileExtension;
        let oldMaterial = this._floorMesh.material;
        var floorTexture = new THREE.TextureLoader().load("images/floors/" + textureName + fileExtension);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set( this._width / 10 , this._height / 10 );
        let newFloorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
        this._floorMesh.material = newFloorMaterial;
        disposeMaterial(oldMaterial);
    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
        this._pivotPoint.add(this._floorMesh);
        //scene.add(this._floorMesh);
    }

    update(timeDelta, rotX, rotY, rotZ) {
        this._pivotPoint.rotation.x += rotX * timeDelta;
        this._pivotPoint.rotation.y += rotY * timeDelta;
        this._pivotPoint.rotation.z += rotZ * timeDelta;
    }

    setWidth(width) {
        this._width = width;
        this._updateGeometry();
    }

    setHeight(height) {
        this._height = height;
        this._updateGeometry();
    }
}
