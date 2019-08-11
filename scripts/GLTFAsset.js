class GLTFAsset {
    constructor(div, asset, { x = 0, y = 0, z = 0, rotationX = 0, rotationY = 0, rotationZ = 0 }) {
        this._assetMesh;
        this._pivotPoint = new THREE.Object3D();
        this._gltfScene;
        this._div = div;
        this._selectedConfigureIndex = 0;
        this._configureElements = [];
        this._configureInputs = [];
        this._initialValues = [x, y, z, rotationX, rotationY, rotationZ];

        this._pivotPoint.translateX(x);
        this._pivotPoint.translateY(y);
        this._pivotPoint.translateZ(z);
        this._pivotPoint.rotation.set(getRadians(rotationX), getRadians(rotationY), getRadians(rotationZ));

        this._createMeshes(asset.name, asset.file, asset);
        this._setConfigureContent();
    }

    _createMeshes(name, file, { scale = 1, x = 0, y = 0, z = 0, rotationX = 0, rotationY = 0, rotationZ = 0 }) {
        var thisObject = this;
        const gltfLoader = new THREE.GLTFLoader();
        const url = "models/" + name + "/" + file;
        gltfLoader.load(url,
            function (gltf) {
                thisObject._gltfScene = gltf.scene;
                thisObject._assetMesh = gltf.scene.children[0].children[0].children[0];
                thisObject._assetMesh.scale.set(thisObject._assetMesh.scale.x * scale, thisObject._assetMesh.scale.x * scale, thisObject._assetMesh.scale.x * scale);
                thisObject._assetMesh.translateX(x);
                thisObject._assetMesh.translateY(y);
                thisObject._assetMesh.translateZ(z);
                thisObject._assetMesh.rotateX(rotationX);
                thisObject._assetMesh.rotateY(rotationY);
                thisObject._assetMesh.rotateZ(rotationZ);
                thisObject._pivotPoint.add(thisObject._assetMesh);
            }
        );
    }

    _setConfigureContent() {
        //Clear inside of div
        while(this._div.firstChild){
            this._div.removeChild(this._div.firstChild);
        }

        let h2 = document.createElement("h2");
        let text = document.createTextNode("Configure");
        h2.appendChild(text);
        this._div.appendChild(h2);
        this._configureElements.push(h2);

        let labels = ['Initial Position (X): ', 'Initial Position (Y): ', 'Initial Position (Z): ', 'Initial Rotation (X): ', 'Initial Rotation (Y): ', 'Initial Rotation (Z): '];
        let ids = ['active-asset-initial-position-x', 'active-asset-initial-position-y', 'active-asset-initial-position-z', 'active-asset-initial-rotation-x', 'active-asset-initial-rotation-y', 'active-asset-initial-rotation-z'];
        let endLabels = ['', '', '', ' Degrees', ' Degrees', ' Degrees'];
        for(let i = 0; i < labels.length; i++) {
            let p = document.createElement("p");
            let input = document.createElement("input");
            let label = document.createTextNode(labels[i]);
            let endLabel = document.createTextNode(endLabels[i]);
            input.id = ids[i];
            input.style.textAlign = "right";
            input.value = this._initialValues[i];
            input.addEventListener('blur', _ => { this._updateAttribute(i) }, false );
            p.appendChild(label);
            p.appendChild(input);
            p.appendChild(endLabel);
            this._div.appendChild(p);
            this._configureInputs.push(input);
            this._configureElements.push(p);
        }
        let p = document.createElement("p");
        let button = document.createElement("button");
        text = document.createTextNode("Delete");
        button.id = "active-asset-delete";
        button.appendChild(text);
        p.appendChild(button);
        this._div.appendChild(p);
        this._configureInputs.push(button);
        this._configureElements.push(p);
        document.getElementById("active-asset-initial-position-x").focus();
    }

    updateActiveAttribute() {
        if(this._selectedConfigureIndex == 6) {
            return true;
        } else {
            this._updateAttribute(this._selectedConfigureIndex);
            return false;
        }
    }

    _updateAttribute(configureIndex) {
        let input = this._configureInputs[configureIndex];
        let value = input.value;
        if(isNaN(value)) {
            input.value = this._initialValues[configureIndex];
        } else if(configureIndex == 0) {
            this._initialValues[configureIndex] = input.value;
            this._pivotPoint.position.x = input.value;
        } else if(configureIndex == 1) {
            this._initialValues[configureIndex] = input.value;
            this._pivotPoint.position.y = input.value;
        } else if(configureIndex == 2) {
            this._initialValues[configureIndex] = input.value;
            this._pivotPoint.position.z = input.value;
        } else if(configureIndex == 3) {
            input.value = Math.round(input.value) % 360;
            this._initialValues[configureIndex] = input.value;
            let radians = (input.value / 180) * Math.PI;
            let rotation = this._pivotPoint.rotation;
            rotation.set(radians, rotation._y, rotation._z);
        } else if(configureIndex == 4) {
            input.value = Math.round(input.value) % 360;
            this._initialValues[configureIndex] = input.value;
            let radians = (input.value / 180) * Math.PI;
            let rotation = this._pivotPoint.rotation;
            rotation.set(rotation._x, radians, rotation._z);
        } else if(configureIndex == 5) {
            input.value = Math.round(input.value) % 360;
            this._initialValues[configureIndex] = input.value;
            let radians = (input.value / 180) * Math.PI;
            let rotation = this._pivotPoint.rotation;
            rotation.set(rotation._x, rotation._y, radians);
        }
    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
    }

    removeFromScene(scene) {
        scene.remove(this._pivotPoint);
        fullDispose(this._pivotPoint);
        this._gltfScene.dispose();
    }

    engage() {
        //Clear inside of div
        while(this._div.firstChild){
            this._div.removeChild(this._div.firstChild);
        }

        for(let i = 0; i < this._configureElements.length; i++) {
            this._div.appendChild(this._configureElements[i]);
        }
        this._configureInputs[this._selectedConfigureIndex].focus();
    }

    moveUp() {
        if(this._selectedConfigureIndex == 0) {
            this._selectedConfigureIndex = this._configureInputs.length - 1;
        } else {
            this._selectedConfigureIndex -= 1;
        }
        this._configureInputs[this._selectedConfigureIndex].focus();
    }

    moveDown() {
        this._selectedConfigureIndex = (this._selectedConfigureIndex + 1) % this._configureInputs.length;
        this._configureInputs[this._selectedConfigureIndex].focus();
    }

    back() {
        return true;
    }

    shouldSuppressMenu() {
        return false;
    }

}
