class PointLight {
    constructor(div, { x = 0, y = 0, z = 0, color = 0xffffff, intensity = 1, distance = 0, decay = 1 }) {
        this._assetMesh;
        this._pivotPoint = new THREE.Object3D();
        this._div = div;
        this._selectedConfigureIndex = 0;
        this._configureElements = [];
        this._configureInputs = [];
        this._initialValues = [x, y, z, '0x' + numberToHexString(color), intensity, distance, decay];

        this._pivotPoint.translateX(x);
        this._pivotPoint.translateY(y);
        this._pivotPoint.translateZ(z);

        this._createLight(color, intensity, distance, decay);
        this._setConfigureContent();
    }

    _createLight(color, intensity, distance, decay) {
        this._assetMesh = new THREE.PointLight(color, intensity, distance, decay);
        this._pivotPoint.add(this._assetMesh);
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

        let labels = ['Initial Position (X): ', 'Initial Position (Y): ', 'Initial Position (Z): ', 'Color: ', 'Intensity: ', 'Maximum Distance: ', 'Decay: '];
        let ids = ['active-asset-initial-position-x', 'active-asset-initial-position-y', 'active-asset-initial-position-z', 'active-asset-color', 'active-asset-intensity', 'active-asset-maximum-distance', 'active-asset-decay'];
        let endLabels = ['', '', '', '', '', ' (0 = no limit)', ''];
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
        if(this._selectedConfigureIndex == 7) {
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
            if(isColorHex(value)) {
                this._initialValues[configureIndex] = input.value;
                this._assetMesh.color.set(parseInt(input.value));
            } else {
                input.value = this._initialValues[configureIndex];
            }
        } else if(configureIndex == 4) {
            this._initialValues[configureIndex] = input.value;
            this._assetMesh.intensity = parseFloat(input.value);
        } else if(configureIndex == 5) {
            this._initialValues[configureIndex] = input.value;
            this._assetMesh.distance = parseFloat(input.value);
        } else if(configureIndex == 6) {
            this._initialValues[configureIndex] = input.value;
            this._assetMesh.decay = parseFloat(input.value);
        }
    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
    }

    removeFromScene(scene) {
        scene.remove(this._pivotPoint);
        fullDispose(this._pivotPoint);
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
