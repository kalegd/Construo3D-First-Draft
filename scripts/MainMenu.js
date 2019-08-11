class MainMenu {
    constructor(dom) {
        this.enabled = false;
        this._dom = dom;
        this._selectedIndex = 0;
        this._numberOfOptions;

        var title = document.createElement("h2");
        var text = document.createTextNode("Main Menu");
        title.appendChild(text);
        this._dom.appendChild(title);

        var options = ['Explore', 'Floor Plan', 'Skybox', 'Camera & Controller Styles', 'Assets'];
        this._numberOfOptions = options.length;
        for(var index = 0; index < options.length; index++) {
            var p = document.createElement("p");
            text = document.createTextNode(options[index]);
            p.appendChild(text);
            this._dom.appendChild(p);
        }

        this._dom.children[this._selectedIndex + 1].classList = ['selected-menu-item'];
    }

    toggleMenu() {
        this.enabled = !this.enabled;
        if(this.enabled) {
            this._dom.classList = ["fade-in"];
        } else {
            this._dom.classList = ["fade-out"];
        }
        return this.enabled;
    }

    selectMenuItem(construo) {
        if(this._selectedIndex == construo._editMode) {
            //Do nothing
            construo._mode = construo._editMode;
        } else if(this._selectedIndex == ModeEnum.NORMAL) {
            this.disengage();
            construo._editMode = ModeEnum.NORMAL;
            construo._mode = ModeEnum.NORMAL;
            construo._onResize();
        } else if(this._selectedIndex == ModeEnum.FLOOR) {
            this.disengage();
            construo._editMode = ModeEnum.FLOOR;
            construo._mode = ModeEnum.FLOOR;
            construo._floorMode.engage();
            construo._onResize();
        } else if(this._selectedIndex == ModeEnum.SKYBOX) {
            this.disengage();
            construo._editMode = ModeEnum.SKYBOX;
            construo._mode = ModeEnum.SKYBOX;
            construo._skyboxMode.engage();
            construo._onResize();
        } else if(this._selectedIndex == ModeEnum.CAMERA) {
            this.disengage();
            construo._editMode = ModeEnum.CAMERA;
            construo._mode = ModeEnum.CAMERA;
            construo._onResize();
        } else if(this._selectedIndex == ModeEnum.ASSET) {
            this.disengage();
            construo._editMode = ModeEnum.ASSET;
            construo._mode = ModeEnum.ASSET;
            construo._assetMode.engage();
            construo._onResize();
        }
        this.toggleMenu();
    }
    
    hardSwitch(construo, mode) {
        this.disengage();
        construo._editMode = mode;
        construo._mode = mode;
        construo._onResize();

        this._dom.children[this._selectedIndex + 1].classList = [];
        this._selectedIndex = 0;
        this._dom.children[this._selectedIndex + 1].classList = ['selected-menu-item'];
    }

    disengage() {
        var engagedDivs = document.getElementsByClassName("mode-engaged");
        while(engagedDivs.length > 0) {
            engagedDivs[0].style.setProperty("display", "none");
            engagedDivs[0].classList = [""];
        }
    }

    getSelectedIndex() {
        return this._selectedIndex;
    }

    moveUp() {
        this._dom.children[this._selectedIndex + 1].classList = [];
        if(this._selectedIndex == 0) {
            this._selectedIndex = this._numberOfOptions - 1;
        } else {
            this._selectedIndex -= 1;
        }
        this._dom.children[this._selectedIndex + 1].classList = ['selected-menu-item'];
    }

    moveDown() {
        this._dom.children[this._selectedIndex + 1].classList = [];
        this._selectedIndex = (this._selectedIndex + 1) % this._numberOfOptions;
        this._dom.children[this._selectedIndex + 1].classList = ['selected-menu-item'];
    }
}
