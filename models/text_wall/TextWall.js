class TextWall {
    constructor(div, { x = 0, y = 0, z = 0, rotationX = 0, rotationY = 0, rotationZ = 0, width = 4, height = 2, backgroundColor = 0x000000, textColor = 0xffffff, font = "Arial", fontSize = 30, transparency = 25, text = "Hello Construo3D World" }) {
        this._assetMesh;
        this._pivotPoint = new THREE.Object3D();
        this._canvas = document.createElement("canvas");
        this._width = width;
        this._height = height;
        this._scaling = 100;
        this._div = div;
        this._selectedConfigureIndex = 0;
        this._configureElements = [];
        this._configureInputs = [];
        this._initialValues = [x, y, z, rotationX, rotationY, rotationZ, width, height, '0x' + numberToHexString(backgroundColor), '0x' + numberToHexString(textColor), font, fontSize, transparency, text];

        this._pivotPoint.translateX(x);
        this._pivotPoint.translateY(y);
        this._pivotPoint.translateZ(z);
        this._pivotPoint.rotation.set(getRadians(rotationX), getRadians(rotationY), getRadians(rotationZ));

        this._createMesh(backgroundColor, textColor, font, fontSize, transparency, text);
        this._setConfigureContent();
    }

    _createMesh(backgroundColor, textColor, font, fontSize, transparency, text) {
        this._canvas.width = this._width * this._scaling;
        this._canvas.height = this._height * this._scaling;
        let context = this._canvas.getContext('2d');
        context.font = fontSize + 'px ' + font;
        context.fillStyle = "#" + numberToHexString(backgroundColor);
        context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        context.fillStyle = "#" + numberToHexString(textColor);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, this._canvas.width / 2, this._canvas.height/2);

        let geometry = new THREE.PlaneBufferGeometry(this._width, this._height);
        let texture = new THREE.Texture(this._canvas);
        //let texture = new THREE.TextureLoader().load("temp.png");
        let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        material.transparent = true;
        material.opacity = 1 - (transparency/100);
        this._assetMesh = new THREE.Mesh( geometry, material );
        this._assetMesh.rotateY(Math.PI);
        this._pivotPoint.add(this._assetMesh);
        this._assetMesh.material.map.needsUpdate = true;
    }

    _updateGeometry() {
        let oldGeometry = this._assetMesh.geometry;
        this._assetMesh.geometry = new THREE.PlaneBufferGeometry(this._width, this._height);
        oldGeometry.dispose();
        this._updateTexture();
    }

    _updateTexture() {
        let backgroundColor = this._initialValues[8];
        let textColor = this._initialValues[9];
        let font = this._initialValues[10];
        let fontSize = this._initialValues[11];
        let transparency = this._initialValues[12];
        let text = this._initialValues[13];
        this._canvas.width = this._width * this._scaling;
        this._canvas.height = this._height * this._scaling;
        let context = this._canvas.getContext('2d');
        context.font = fontSize + 'px ' + font;
        context.fillStyle = "#" + backgroundColor.substring(2);
        context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        context.fillStyle = "#" + textColor.substring(2);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, this._canvas.width / 2, this._canvas.height/2);

        this._assetMesh.material.opacity = 1 - (transparency/100);
        this._assetMesh.material.map.needsUpdate = true;
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

        let labels = ['Initial Position (X): ', 'Initial Position (Y): ', 'Initial Position (Z): ', 'Initial Rotation (X): ', 'Initial Rotation (Y): ', 'Initial Rotation (Z): ', 'Width: ', 'Height: ', 'Background Color: ', 'Text Color: ', 'Font: ', 'Font Size: ', 'Transparency: ', 'Text: '];
        let ids = ['active-asset-initial-position-x', 'active-asset-initial-position-y', 'active-asset-initial-position-z', 'active-asset-initial-rotation-x', 'active-asset-initial-rotation-y', 'active-asset-initial-rotation-z', 'active-asset-width', 'active-asset-height', 'active-asset-background-color', 'active-asset-text-color', 'active-asset-font', 'active-asset-font-size', 'active-asset-transparency', 'active-asset-text'];
        let endLabels = ['', '', '', ' Degrees', ' Degrees', ' Degrees', '', '', '', '', '', '', ' %', ''];
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
        if(this._selectedConfigureIndex == 14) {
            return true;
        } else {
            this._updateAttribute(this._selectedConfigureIndex);
            return false;
        }
    }

    _updateAttribute(configureIndex) {
        let input = this._configureInputs[configureIndex];
        let value = input.value;
        if(input.value == this._initialValues[configureIndex]) {
            //No updates necessary
        } else if(input.value == "") {
            input.value = this._initialValues[configureIndex];
        } else if(configureIndex == 10) { //Font
            this._initialValues[configureIndex] = input.value;
            this._updateTexture();
        } else if(configureIndex == 13) { //Text
            this._initialValues[configureIndex] = input.value;
            this._updateTexture();
        } else if(isNaN(value)) {
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
        } else if(configureIndex == 6) { //Width
            if(input.value <= 0) {
                input.value = this._initialValues[configureIndex];
            } else if(input.value != this._initialValues[configureIndex]) {
                this._initialValues[configureIndex] = input.value;
                this._width = input.value;
                this._canvas.width = this._width * this._scaling;
                this._updateGeometry();
            }
        } else if(configureIndex == 7) { //Height
            if(input.value <= 0) {
                input.value = this._initialValues[configureIndex];
            } else if(input.value != this._initialValues[configureIndex]) {
                this._initialValues[configureIndex] = input.value;
                this._height = input.value;
                this._canvas.height = this._height * this._scaling;
                this._updateGeometry();
            }
        } else if(configureIndex == 8 || configureIndex == 9) { //Colors
            if(!isColorHex(input.value)) {
                input.value = this._initialValues[configureIndex];
            } else if(input.value != this._initialValues[configureIndex]) {
                this._initialValues[configureIndex] = input.value;
                this._updateTexture();
            }
        } else if(configureIndex == 11) { //Font Size
            if(input.value <= 0) {
                input.value = this._initialValues[configureIndex];
            } else if(input.value != this._initialValues[configureIndex]) {
                this._initialValues[configureIndex] = input.value;
                this._updateTexture();
            }
        } else if(configureIndex == 12) { //Transparency
            if(input.value < 0 || input.value > 100) {
                input.value = this._initialValues[configureIndex];
            } else if(input.value != this._initialValues[configureIndex]) {
                this._initialValues[configureIndex] = input.value;
                this._updateTexture();
            }
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
        if(this._selectedConfigureIndex == 8 || this._selectedConfigureIndex == 9 || this._selectedConfigureIndex == 10 || this._selectedConfigureIndex == 13) {
            return false;
        } else {
            return true;
        }
    }

    shouldSuppressMenu() {
        if(this._selectedConfigureIndex == 10 || this._selectedConfigureIndex == 13) {
            return true;
        } else {
            return false;
        }
    }

}
