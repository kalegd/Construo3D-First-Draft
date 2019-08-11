THREE.Cache.enabled = true;

//There is tight coupling to the options in MainMenu.js here
var ModeEnum = {
    NORMAL: 0,
    FLOOR: 1,
    SKYBOX: 2,
    CAMERA: 3,
    ASSET: 4,
    MAIN_MENU: 5
};

var SKYBOXES = [
    {
        name: "space_1",
        extension: ".png",
        preview: "back_space_1.png"
    },
    {
        name: "space_2",
        extension: ".png",
        preview: "up_space_2.png"
    },
    {
        name: "clouds_1",
        extension: ".bmp",
        preview: "up_clouds_1.bmp"
    },
    {
        name: "blue_sky_1",
        extension: ".png",
        preview: "front_blue_sky_1.png"
    },
    {
        name: "night_moon_1",
        extension: ".png",
        preview: "front_night_moon_1.png"
    }
];

var FLOORS = [
    {
        name: "futuristic_1",
        extension: ".jpg",
    },
    {
        name: "concrete_1",
        extension: ".png",
    },
    {
        name: "grass_1",
        extension: ".jpg",
    }
];

var ASSETS = [
    {
        name: "picnic_table_1",
        preview: "preview.jpeg",
        type: "GLTF",
        file: "scene.gltf",
        scale: 1/64,
        rotationX: Math.PI / -2
    },
    {
        name: "laurel_tree_1",
        preview: "preview.jpeg",
        type: "GLTF",
        file: "scene.gltf",
        scale: 1/32,
        rotationX: Math.PI / -2
    },
    {
        name: "point_light",
        preview: "preview.png",
        type: "JS",
        className: PointLight,
    },
    {
        name: "text_wall",
        preview: "preview.png",
        type: "JS",
        className: TextWall,
    }
];

class Construo {
    constructor() {
        //Scene and Renderer Variables
        this._width;
        this._height;
        this._renderer;
        this._camera;
        this._aspect;
        this._settings;
        this._logoMesh;
        this._skyboxMesh;
        this._floor;
        this._mode = ModeEnum.NORMAL;
        this._editMode = ModeEnum.NORMAL;
        this._floorMode = new FloorMode(this);
        this._skyboxMode = new SkyboxMode(this);
        this._assetMode = new AssetMode(this);
        this._containerDom = document.querySelector('#container');
        this._startMessageDom = document.querySelector('#start');
        this._mainMenuDom = document.querySelector('#main-menu');
        this._mainMenu = new MainMenu(this._mainMenuDom);
        this._walkingSpaceWidth = 100;
        this._walkingSpaceHeight = 100;
        this._skyboxLength = 10000;
        this._logoRadius = 1;

        //Camera Variables
        this._fieldOfViewAngle = 45;
        this._near = 0.1;
        this._far = 10000;

        //Movement Variables
        this._velocity = new THREE.Vector3();
        this._clock = new THREE.Clock();
        this._moveForward = false;
        this._moveBackward = false;
        this._moveLeft = false;
        this._moveRight = false;

        //Stats
        this._stats = new Stats();
        this._stats.showPanel(0);
        document.body.appendChild(this._stats.dom);

        this.clearContainer();
        this.createRenderer();

        this._onResize = this._onResize.bind(this);
        this._update = this._update.bind(this);
        this._onResize();

        this.createScene();
        this.createCamera();
        this.createMeshes();
        this.createLight();

        this.addEventListeners();
        this._enableKeyboardMouse();
        requestAnimationFrame(this._update);
    }

    clearContainer() {
        this._containerDom.innerHTML = '';
    }

    createRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias : true });
        //this._renderer.shadowMap.enabled = true;
        //this._renderer.vr.enabled = true;
        //this._containerDom.appendChild(THREE.WEBVR.createButton(this._renderer.domElement));
        this._containerDom.appendChild(this._renderer.domElement);
    }

    createCamera() {
        this._camera = new THREE.PerspectiveCamera(
            this._fieldOfViewAngle,
            this._aspect,
            this._near,
            this._far
        );
    }

    createScene() {
        this._scene = new THREE.Scene();
    }

    createMeshes() {
        this._logoMesh = new Logo(this._logoRadius, 0, 30, 0);
        this._logoMesh.addToScene(this._scene);

        this._skybox = new Skybox(this._skyboxLength, "space_1", ".png");
        this._skybox.addToScene(this._scene);

        this._floor = new Floor(this._walkingSpaceWidth, this._walkingSpaceHeight, "futuristic_1", ".jpg");
        this._floor.addToScene(this._scene);
    }

    createLight() {
        //Scene specific lighting here
    }

    _pointerLockChanged() {
        if (document.pointerLockElement === document.body ||
                document.mozPointerLockElement === document.body ||
                document.webkitPointerLockElement === document.body) {
            this._controls.enabled = true;
            this._hideStartMessage();
        } else {
            this._showStartMessage();
            this._controls.enabled = false;
            this._moveForward = false;
            this._moveBackward = false;
            this._moveLeft = false;
            this._moveRight = false;
        }
    }

    _onResize () {
        if(this._mode == ModeEnum.NORMAL) {
            this._width = window.innerWidth;
        } else {
            this._width = window.innerWidth / 2;
        }
        this._height = window.innerHeight;
        this._aspect = this._width / this._height;

        this._renderer.setSize(this._width, this._height);

        //if (this._magicWindowCanvas) {
        //  this._magicWindowCanvas.width = this._width;
        //  this._magicWindowCanvas.height = this._height;
        //}

        if (!this._camera) {
          return;
        }

        this._camera.aspect = this._aspect;
        this._camera.updateProjectionMatrix();
    }

    _onKeyDown(event){
        event = event || window.event;
        var keycode = event.keyCode;
        if(!this._controls.enabled) {
            //Do nothing
            event.preventDefault();
        } else if(keycode == 65) { //a
            this._moveLeft = true;
        } else if(keycode == 87) { //w
            this._moveForward = true;
        } else if(keycode == 68) { //d
            this._moveRight = true;
        } else if(keycode == 83) { //s
            this._moveBackward = true;
        } else if(keycode == 37) { //left arrow
            this._moveLeft = true;
            if(this._mainMenu.enabled) {
                event.preventDefault();
            } else if(this._mode == ModeEnum.FLOOR) {
                this._floorMode.moveLeft();
            } else if(this._mode == ModeEnum.SKYBOX) {
                this._skyboxMode.moveLeft();
            } else if(this._mode == ModeEnum.ASSET) {
                this._assetMode.moveLeft();
            }
        } else if(keycode == 38) { //up arrow
            this._moveForward = true;
            if(this._mainMenu.enabled) {
                this._mainMenu.moveUp();
            } else if(this._mode == ModeEnum.FLOOR) {
                this._floorMode.moveUp();
            } else if(this._mode == ModeEnum.SKYBOX) {
                this._skyboxMode.moveUp();
            } else if(this._mode == ModeEnum.ASSET) {
                this._assetMode.moveUp();
            }
        } else if(keycode == 39) { //right arrow
            this._moveRight = true;
            if(this._mainMenu.enabled) {
                event.preventDefault();
            } else if(this._mode == ModeEnum.FLOOR) {
                this._floorMode.moveRight();
            } else if(this._mode == ModeEnum.SKYBOX) {
                this._skyboxMode.moveRight();
            } else if(this._mode == ModeEnum.ASSET) {
                this._assetMode.moveRight();
            }
        } else if(keycode == 40) { //down arrow
            this._moveBackward = true;
            if(this._mainMenu.enabled) {
                this._mainMenu.moveDown();
            } else if(this._mode == ModeEnum.FLOOR) {
                this._floorMode.moveDown();
            } else if(this._mode == ModeEnum.SKYBOX) {
                this._skyboxMode.moveDown();
            } else if(this._mode == ModeEnum.ASSET) {
                this._assetMode.moveDown();
            }
        } else if(keycode == 13) { // Enter
            if(this._mainMenu.enabled) {
                this._mainMenu.selectMenuItem(this);
            } else if(this._mode == ModeEnum.FLOOR) {
                this._floorMode.select();
            } else if(this._mode == ModeEnum.SKYBOX) {
                this._skyboxMode.select();
            } else if(this._mode == ModeEnum.ASSET) {
                this._assetMode.select();
            }
        } else if(keycode == 77) { // m
            if(this._editMode == ModeEnum.FLOOR) {
                event.preventDefault();
            } else if(this._editMode == ModeEnum.SKYBOX) {
                event.preventDefault();
            } else if(this._editMode == ModeEnum.ASSET) {
                if(!this._assetMode.shouldSuppressMenu()) {
                    event.preventDefault();
                }
            }
        } else if(keycode == 66) { // b
            if(this._mainMenu.enabled) {
                if(this._mainMenu.toggleMenu()) {
                    this._editMode = this._mode;
                    this._mode = ModeEnum.MAIN_MENU;
                } else {
                    this._mode = this._editMode;
                }
            } else if(this._mode == ModeEnum.FLOOR) {
                if(!this._floorMode.back()) {
                    this._mainMenu.hardSwitch(this, ModeEnum.NORMAL);
                }
                event.preventDefault();
            } else if(this._mode == ModeEnum.SKYBOX) {
                if(!this._skyboxMode.back()) {
                    this._mainMenu.hardSwitch(this, ModeEnum.NORMAL);
                }
                event.preventDefault();
            } else if(this._mode == ModeEnum.ASSET) {
                if(!this._assetMode.back()) {
                    this._mainMenu.hardSwitch(this, ModeEnum.NORMAL);
                }
            }
        } else if(keycode == 9) { // Tab, don't need this until TAB teleportation
            event.preventDefault();
        } else if(this._mainMenu.enabled) {
            event.preventDefault();
        }
    }
    _onKeyUp(event){
        event = event || window.event;
        var keycode = event.keyCode;
        if(!this._controls.enabled) {
            //Do nothing
            event.preventDefault();
        } else if(keycode == 37 || keycode == 65) { //left arrow
            this._moveLeft = false;
        } else if(keycode == 38 || keycode == 87) { //up arrow
            this._moveForward = false;
        } else if(keycode == 39 || keycode == 68) { //right arrow
            this._moveRight = false;
        } else if(keycode == 40 || keycode == 83) { //down arrow
            this._moveBackward = false;
        } else if(keycode == 77) { // m
            //Bring up Menu
            if(this._editMode == ModeEnum.ASSET && this._assetMode.shouldSuppressMenu()) {
                //Do nothing
            } else if(this._mainMenu.toggleMenu()) {
                this._editMode = this._mode;
                this._mode = ModeEnum.MAIN_MENU;
            } else {
                this._mode = this._editMode;
            }
        }
    }

    _hideStartMessage() {
         this._startMessageDom.style.display = 'none';
         this._mainMenuDom.style.display = 'block';
    }

    _showStartMessage() {
         this._startMessageDom.style.display = 'block';
         this._mainMenuDom.style.display = 'none';
    }

    addEventListeners() {
        window.addEventListener('resize', this._onResize);
        window.addEventListener('wheel', function(event) {
            event.preventDefault();
        }, {passive: false, capture: true});
    }

    _enableKeyboardMouse() {
        if (!this._hasPointerLock()) {
            return;
        }
        this._controls = new THREE.PointerLockControls(this._camera);
        this._scene.add(this._controls.getObject());
        this._controls.getObject().position.y = 1.7;
        this._camera.lookAt(new THREE.Vector3(0, 1.7, 1));
        document.addEventListener('pointerlockchange', _ =>
            { this._pointerLockChanged() }, false );
        document.addEventListener('mozpointerlockchange', _ =>
            { this._pointerLockChanged() }, false );
        document.addEventListener('webkitpointerlockchange', _ =>
            { this._pointerLockChanged() }, false );
        document.addEventListener('keydown', event =>
            { this._onKeyDown(event) }, false );
        document.addEventListener('keyup', event =>
            { this._onKeyUp(event) }, false );

        document.body.addEventListener( 'click', _ => {
            // Ask the browser to lock the pointer
            document.body.requestPointerLock = document.body.requestPointerLock ||
                document.body.mozRequestPointerLock ||
                document.body.webkitRequestPointerLock;
            document.body.requestPointerLock();
        }, false);
    }

    _hasPointerLock() {
        let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        return havePointerLock;
    }

    _update () {
        this._stats.begin();
        var timeDelta = this._clock.getDelta();

        this._logoMesh.update(timeDelta, -0.5, -0.5, 0);
    
        if (this._controls && this._controls.enabled && this._mode == ModeEnum.NORMAL) {
            this._updatePosition(timeDelta);
        }
        //this._skybox.update(timeDelta, 0.01, 0, 0);
    
        // Draw!
        this._renderer.render(this._scene, this._camera);

        this._stats.end();

        // Schedule the next frame.
        requestAnimationFrame(this._update);
    }

    _updatePosition(timeDelta) {
        // Decrease the velocity.
        this._velocity.x -= this._velocity.x * 10.0 * timeDelta;
        this._velocity.z -= this._velocity.z * 10.0 * timeDelta;

        let controls_yaw = this._controls.getObject();

        let movingDistance = 100.0 * timeDelta;
        if (this._moveForward) {
            this._velocity.z += movingDistance;
        }
        if (this._moveBackward) {
            this._velocity.z -= movingDistance;
        }
        if (this._moveLeft) {
            this._velocity.x += movingDistance;
        }
        if (this._moveRight) {
            this._velocity.x -= movingDistance;
        }

        controls_yaw.translateX(this._velocity.x * timeDelta);
        controls_yaw.translateZ(this._velocity.z * timeDelta);

        // Check bounds so we don't walk through the walls.
        if (controls_yaw.position.z > this._walkingSpaceHeight / 2)
          controls_yaw.position.z = this._walkingSpaceHeight / 2;
        if (controls_yaw.position.z < -1 * this._walkingSpaceHeight / 2)
          controls_yaw.position.z = -1 * this._walkingSpaceHeight / 2;

        if (controls_yaw.position.x > this._walkingSpaceWidth / 2)
          controls_yaw.position.x = this._walkingSpaceWidth / 2;
        if (controls_yaw.position.x < -1 * this._walkingSpaceWidth / 2)
          controls_yaw.position.x = -1 * this._walkingSpaceWidth / 2;
    }
}

var construo = new Construo();
