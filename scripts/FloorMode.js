class FloorMode {
    constructor(construo) {
        this._construo = construo;
        this._div = document.getElementById("floor-mode");
        this._selectDiv = document.getElementById("select-floor");
        this._configureDiv = document.getElementById("configure-floor");
        this._selectedIndex = 0;
        this._selectedConfigureIndex = 0;
        this._page = "SELECT";
        this._numberOfOptions = FLOORS.length;
        this._configureElements = [document.getElementById('floor-width'), document.getElementById('floor-height')];
        this._addEventListeners();

        this._div.style.setProperty("display", "none");
        this._selectDiv.style.setProperty("display", "none");
        this._configureDiv.style.setProperty("display", "none");


        for(var i = 0; i < FLOORS.length; i ++) {
            let floor = FLOORS[i];
            let image = new Image;
            image.src = "images/floors/" + floor.name + floor.extension;
            image.width = 128;
            image.height = 128;
            if(i == 0) {
                image.classList = ['selected-image'];
            }
            this._selectDiv.appendChild(image);
        }

    }

    _addEventListeners() {
        document.getElementById('floor-width').addEventListener('blur', _ => { this._updateFloorWidth() }, false );
        document.getElementById('floor-height').addEventListener('blur', _ => { this._updateFloorHeight() }, false );
    }

    _updateFloorWidth() {
        let element = this._configureElements[0];
        let width = element.value;
        if(isNaN(width)) {
            element.value = this._construo._walkingSpaceWidth;
        } else {
            element.value = Math.max(2, Math.round(element.value));
            this._construo._walkingSpaceWidth = element.value;
            this._construo._floor.setWidth(element.value);
        }
    }

    _updateFloorHeight() {
        let element = this._configureElements[1];
        let height = element.value;
        if(isNaN(height)) {
            element.value = this._construo._walkingSpaceHeight;
        } else {
            element.value = Math.max(2, Math.round(element.value));
            this._construo._walkingSpaceHeight = element.value;
            this._construo._floor.setHeight(element.value);
        }
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
            let floor = FLOORS[this._selectedIndex];
            this._construo._floor.updateTexture(floor.name, floor.extension);
            this._page = "CONFIGURE";
            this._selectDiv.style.setProperty("display", "none");
            this._selectDiv.classList = [];
            this._configureDiv.style.setProperty("display", "block");
            this._configureDiv.classList = ["mode-engaged"];
            this._selectedConfigureIndex = 0;
            document.getElementById("floor-width").focus();
        } else if(this._page == "CONFIGURE") {
            if(this._configureElements[0] == document.activeElement) {
                this._updateFloorWidth()
            } else if(this._configureElements[1] == document.activeElement) {
                this._updateFloorHeight()
            }
        }
    }
}
