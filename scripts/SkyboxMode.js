class SkyboxMode {
    constructor(construo) {
        this._construo = construo;
        this._div = document.getElementById("skybox-mode");
        this._selectDiv = document.getElementById("select-skybox");
        this._configureDiv = document.getElementById("configure-skybox");
        this._activeSkyboxIndex = 0;
        this._selectedIndex = 0;
        this._selectedConfigureIndex = 0;
        this._page = "SELECT";
        this._numberOfOptions = SKYBOXES.length;
        this._configureElements = [document.getElementById('skybox-initial-rotation-x'), document.getElementById('skybox-initial-rotation-y'), document.getElementById('skybox-initial-rotation-z')];
        this._initialRotations = [0,0,0];
        this._addEventListeners();

        this._div.style.setProperty("display", "none");
        this._selectDiv.style.setProperty("display", "none");
        this._configureDiv.style.setProperty("display", "none");


        for(var i = 0; i < SKYBOXES.length; i ++) {
            let skybox = SKYBOXES[i];
            let image = new Image;
            image.src = "images/skyboxes/" + skybox.name + "/" + skybox.preview;
            image.width = 128;
            image.height = 128;
            if(i == 0) {
                image.classList = ['selected-image'];
            }
            this._selectDiv.appendChild(image);
        }

    }

    _addEventListeners() {
        document.getElementById('skybox-initial-rotation-x').addEventListener('blur', _ => { this._updateInitialRotation(0) }, false );
        document.getElementById('skybox-initial-rotation-y').addEventListener('blur', _ => { this._updateInitialRotation(1) }, false );
        document.getElementById('skybox-initial-rotation-z').addEventListener('blur', _ => { this._updateInitialRotation(2) }, false );
    }

    _updateInitialRotation(configureIndex) {
        let element = this._configureElements[configureIndex];
        let rotation = element.value;
        if(isNaN(rotation)) {
            element.value = this._initialRotations[configureIndex];
        } else {
            element.value = Math.round(element.value) % 360;
            this._initialRotations[configureIndex] = element.value;
            let radians = (element.value / 180) * Math.PI;
            if(configureIndex == 0) {
                this._construo._skybox.setRotationX(radians);
            } else if(configureIndex == 1) {
                this._construo._skybox.setRotationY(radians);
            } else if(configureIndex == 2) {
                this._construo._skybox.setRotationZ(radians);
            }
        }
    }

    _resetInitialRotations() {
        this._initialRotations = [0,0,0];
        this._construo._skybox.setRotationX(0);
        this._construo._skybox.setRotationY(0);
        this._construo._skybox.setRotationZ(0);
        this._configureElements[0].value = 0;
        this._configureElements[1].value = 0;
        this._configureElements[2].value = 0;
    }

    back() {
        if(this._page == "CONFIGURE") {
            this.engage();
            return true;
        } else {
            return false;
        }
    }

    engage() {
        this._div.style.setProperty("display", "block");
        this._div.classList = ["mode-engaged"];
        this._selectDiv.style.setProperty("display", "block");
        this._selectDiv.classList = ["mode-engaged"];
        this._configureDiv.style.setProperty("display", "none");
        this._configureDiv.classList = [""];
        this._page = "SELECT";
    }

    moveUp() {
        if(this._page == "CONFIGURE") {
            if(this._selectedConfigureIndex == 0) {
                this._selectedConfigureIndex = this._configureElements.length - 1;
            } else {
                this._selectedConfigureIndex -= 1;
            }
            this._configureElements[this._selectedConfigureIndex].focus();
        }
    }

    moveDown() {
        if(this._page == "CONFIGURE") {
            this._selectedConfigureIndex = (this._selectedConfigureIndex + 1) % this._configureElements.length;
            this._configureElements[this._selectedConfigureIndex].focus();
        }
    }

    moveLeft() {
        if(this._page == "SELECT") {
            this._selectDiv.children[this._selectedIndex].classList = [];
            if(this._selectedIndex == 0) {
                this._selectedIndex = this._numberOfOptions - 1;
            } else {
                this._selectedIndex -= 1;
            }
            this._selectDiv.children[this._selectedIndex].classList = ['selected-image'];
        }
    }

    moveRight() {
        if(this._page == "SELECT") {
            this._selectDiv.children[this._selectedIndex].classList = [];
            this._selectedIndex = (this._selectedIndex + 1) % this._numberOfOptions;
            this._selectDiv.children[this._selectedIndex].classList = ['selected-image'];
        }
    }

    select() {
        if(this._page == "SELECT") {
            let skybox = SKYBOXES[this._selectedIndex];
            this._construo._skybox.changeMaterial(skybox.name, skybox.extension);
            this._page = "CONFIGURE";
            this._selectDiv.style.setProperty("display", "none");
            this._selectDiv.classList = [];
            this._configureDiv.style.setProperty("display", "block");
            this._configureDiv.classList = ["mode-engaged"];
            this._selectedConfigureIndex = 0;
            document.getElementById("skybox-initial-rotation-x").focus();
            if(this._activeSkyboxIndex != this._selectedIndex) {
                this._resetInitialRotations();
                this._activeSkyboxIndex = this._selectedIndex;
            }
        } else if(this._page == "CONFIGURE") {
            if(this._configureElements[0] == document.activeElement) {
                this._updateInitialRotation(0)
            } else if(this._configureElements[1] == document.activeElement) {
                this._updateInitialRotation(1)
            } else if(this._configureElements[2] == document.activeElement) {
                this._updateInitialRotation(2)
            }
        }
    }
}
