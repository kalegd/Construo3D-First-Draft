class AssetMode {
    constructor(construo) {
        this._construo = construo;
        this._div = document.getElementById("asset-mode");
        this._selectModeDiv = document.getElementById("select-asset-mode");
        this._addDiv = document.getElementById("add-asset");
        this._selectAssetDiv = document.getElementById("select-asset");
        this._configureDiv = document.getElementById("configure-asset");
        this._selectedModeIndex = 0;
        this._selectedAddIndex = 0;
        this._activeAssetIndex = 0;
        this._page = "SELECT_MODE";//SELECT_MODE, ADD, SELECT_ASSET, EDIT
        this._activeAssets = [];
        //this._addEventListeners();

        this._div.style.setProperty("display", "none");
        this._selectModeDiv.style.setProperty("display", "none");
        this._addDiv.style.setProperty("display", "none");
        this._selectAssetDiv.style.setProperty("display", "none");
        this._configureDiv.style.setProperty("display", "none");

        this._selectModeDiv.children[this._selectedModeIndex + 1].classList = ['selected-asset-item'];

        for(var i = 0; i < ASSETS.length; i ++) {
            let asset = ASSETS[i];
            let image = new Image;
            image.src = "models/" + asset.name + "/" + asset.preview;
            image.width = 256;
            image.height = 144;
            if(i == 0) {
                image.classList = ['selected-image'];
            }
            this._addDiv.appendChild(image);
        }

    }

    //_addEventListeners() {
    //    document.getElementById('asset-width').addEventListener('blur', _ => { this._updateAssetWidth() }, false );
    //    document.getElementById('asset-height').addEventListener('blur', _ => { this._updateAssetHeight() }, false );
    //}

    //_updateAssetWidth() {
    //    let element = this._configureElements[0];
    //    let width = element.value;
    //    if(isNaN(width)) {
    //        element.value = this._construo._walkingSpaceWidth;
    //    } else {
    //        element.value = Math.max(2, Math.round(element.value));
    //        this._construo._walkingSpaceWidth = element.value;
    //        this._construo._asset.setWidth(element.value);
    //    }
    //}

    //_updateAssetHeight() {
    //    let element = this._configureElements[1];
    //    let height = element.value;
    //    if(isNaN(height)) {
    //        element.value = this._construo._walkingSpaceHeight;
    //    } else {
    //        element.value = Math.max(2, Math.round(element.value));
    //        this._construo._walkingSpaceHeight = element.value;
    //        this._construo._asset.setHeight(element.value);
    //    }
    //}

    _addSelectAssetElement(asset) {
        let image = new Image;
        image.src = "models/" + asset.name + "/" + asset.preview;
        image.width = 256;
        image.height = 144;
        image.classList = ['selected-image'];
        if(this._selectAssetDiv.children.length != 0) {
            this._selectAssetDiv.children[this._activeAssetIndex].classList = [];
        }
        this._selectAssetDiv.appendChild(image);
    }

    back() {
        if(this._page == "CONFIGURE") {
            if(this._activeAssets[this._activeAssetIndex].back()) {
                this._page = "SELECT_ASSET";
                this._configureDiv.style.setProperty("display", "none");
                this._configureDiv.classList = [""];
                this._configureDiv.innerHTML = "";
                this._selectAssetDiv.style.setProperty("display", "block");
                this._selectAssetDiv.classList = ["mode-engaged"];
            }
            return true;
        } else if(this._page != "SELECT_MODE") {
            this.engage();
            return true;
        } else {
            return false;
        }
    }

    shouldSuppressMenu() {
        if(this._page == "CONFIGURE") {
            return this._activeAssets[this._activeAssetIndex].shouldSuppressMenu();
        } else {
            return false;
        }
    }

    engage() {
        this._div.style.setProperty("display", "block");
        this._div.classList = ["mode-engaged"];
        this._selectModeDiv.style.setProperty("display", "block");
        this._selectModeDiv.classList = ["mode-engaged"];

        this._addDiv.style.setProperty("display", "none");
        this._addDiv.classList = [""];
        this._selectAssetDiv.style.setProperty("display", "none");
        this._selectAssetDiv.classList = [""];
        this._configureDiv.style.setProperty("display", "none");
        this._configureDiv.classList = [""];

        this._page = "SELECT_MODE";
    }

    moveUp() {
        if(this._page == "SELECT_MODE") {
            this._selectModeDiv.children[this._selectedModeIndex + 1].classList = [];
            this._selectedModeIndex = (this._selectedModeIndex + 1) % 2;
            this._selectModeDiv.children[this._selectedModeIndex + 1].classList = ['selected-asset-item'];
        } else if(this._page == "CONFIGURE") {
            this._activeAssets[this._activeAssetIndex].moveUp();
        }
    }

    moveDown() {
        if(this._page == "SELECT_MODE") {
            this._selectModeDiv.children[this._selectedModeIndex + 1].classList = [];
            this._selectedModeIndex = (this._selectedModeIndex + 1) % 2;
            this._selectModeDiv.children[this._selectedModeIndex + 1].classList = ['selected-asset-item'];
        } else if(this._page == "CONFIGURE") {
            this._activeAssets[this._activeAssetIndex].moveDown();
        }
    }

    moveLeft() {
        if(this._page == "ADD") {
            this._addDiv.children[this._selectedAddIndex].classList = [];
            if(this._selectedAddIndex == 0) {
                this._selectedAddIndex = ASSETS.length - 1;
            } else {
                this._selectedAddIndex -= 1;
            }
            this._addDiv.children[this._selectedAddIndex].classList = ['selected-image'];
        } else if(this._page == "SELECT_ASSET" && this._selectAssetDiv.children.length != 0) {
            this._selectAssetDiv.children[this._activeAssetIndex].classList = [];
            if(this._activeAssetIndex == 0) {
                this._activeAssetIndex = this._selectAssetDiv.children.length - 1;
            } else {
                this._activeAssetIndex -= 1;
            }
            this._selectAssetDiv.children[this._activeAssetIndex].classList = ['selected-image'];
        }
    }

    moveRight() {
        if(this._page == "ADD") {
            this._addDiv.children[this._selectedAddIndex].classList = [];
            this._selectedAddIndex = (this._selectedAddIndex + 1) % ASSETS.length;
            this._addDiv.children[this._selectedAddIndex].classList = ['selected-image'];
        } else if(this._page == "SELECT_ASSET" && this._selectAssetDiv.children.length != 0) {
            this._selectAssetDiv.children[this._activeAssetIndex].classList = [];
            this._activeAssetIndex = (this._activeAssetIndex + 1) % this._selectAssetDiv.children.length;
            this._selectAssetDiv.children[this._activeAssetIndex].classList = ['selected-image'];
        }
    }

    select() {
        if(this._page == "SELECT_MODE") {
            if(this._selectedModeIndex == 0) {
                this._page = "ADD";
                this._selectModeDiv.style.setProperty("display", "none");
                this._selectModeDiv.classList = [];
                this._addDiv.style.setProperty("display", "block");
                this._addDiv.classList = ["mode-engaged"];
            } else {
                this._page = "SELECT_ASSET";
                this._selectModeDiv.style.setProperty("display", "none");
                this._selectModeDiv.classList = [];
                this._selectAssetDiv.style.setProperty("display", "block");
                this._selectAssetDiv.classList = ["mode-engaged"];
            }
        } else if(this._page == "ADD") {
            this._page = "CONFIGURE";
            this._addDiv.style.setProperty("display", "none");
            this._addDiv.classList = [];
            this._configureDiv.style.setProperty("display", "block");
            this._configureDiv.classList = ["mode-engaged"];
            let asset = ASSETS[this._selectedAddIndex];
            this._addSelectAssetElement(asset);
            var newAsset;
            if(asset.type == "GLTF") {
                newAsset = new GLTFAsset(this._configureDiv, asset, {});
            } else {
                newAsset = new asset.className(this._configureDiv, {});
            }
            this._activeAssets.push(newAsset);
            this._activeAssetIndex = this._activeAssets.length - 1;
            newAsset.addToScene(this._construo._scene);
        } else if(this._page == "SELECT_ASSET") {
            this._page = "CONFIGURE";
            this._selectAssetDiv.style.setProperty("display", "none");
            this._selectAssetDiv.classList = [];
            this._configureDiv.style.setProperty("display", "block");
            this._configureDiv.classList = ["mode-engaged"];
            this._activeAssets[this._activeAssetIndex].engage();
        } else if(this._page == "CONFIGURE") {
            if(this._activeAssets[this._activeAssetIndex].updateActiveAttribute()) {
                this.back();
                this._activeAssets[this._activeAssetIndex].removeFromScene(this._construo._scene);
                this._activeAssets.splice(this._activeAssetIndex,1);
                this._selectAssetDiv.children[this._activeAssetIndex].remove();
                this._activeAssetIndex = 0;
            }
        }
    }
}
