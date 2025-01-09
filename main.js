class ClassPlayer {
    constructor(x, y, z, width, height, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 500;
        this.maxVelocity = 10;
    }

    getVertices(canvas, camera) {
        // Нормалізація розміру гравця
        const halfWidth = (this.width / 2) / (canvas.width / 2);
        const halfHeight = (this.height / 2) / (canvas.height / 2);

        // Нормалізація координат гравця
        const normalizedX = ((this.x - camera.x) / (canvas.width / 2));
        const normalizedY = ((this.y - camera.y) / (canvas.height / 2));
        const normalizedZ = -this.z / 1000;

        const playerVertices = [
            normalizedX + halfWidth, normalizedY + halfHeight, normalizedZ,
            normalizedX + halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX + halfWidth, normalizedY + halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY + halfHeight, normalizedZ
        ];

        return playerVertices;
    }

    move(deltaTime, keys, camera) {
        let dx = 0;
        let dy = 0;

        if (keys.up) dy += this.speed * deltaTime;
        if (keys.down) dy -= this.speed * deltaTime;
        if (keys.left) dx -= this.speed * deltaTime;
        if (keys.right) dx += this.speed * deltaTime;

        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude > 0) {
            dx = (dx / magnitude) * this.speed * deltaTime;
            dy = (dy / magnitude) * this.speed * deltaTime;
        }

        this.x += dx;
        this.y += dy;

        camera.x += dx;
        camera.y += dy;
    }

    getAngleToCursor(mouse, canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
    
        const deltaX = mouse.x - centerX;
        const deltaY = mouse.y - centerY;
        const angle = Math.atan2(deltaY, deltaX);

        // Конвертація в діапазон 0–360 градусів
        const angleInDegrees = (angle * 180 / Math.PI + 360) % 360;

        // console.log(`Mouse X: ${mouse.x}, Mouse Y: ${mouse.y}`);
        // console.log(`Center X: ${centerX}, Center Y: ${centerY}`);
        // console.log(`Delta X: ${deltaX}, Delta Y: ${deltaY}`);
        // console.log(`Angle (Radians): ${angle}`);
        // console.log(`Angle (Degrees): ${(angle * 180 / Math.PI + 360) % 360}`);
        return angle;
    }
}

class ClassObj {
    constructor(x, y, z, width, height, color, objects){
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.color = color;
        objects.push(this);
    }

    getVertices(canvas, camera) {
        // Нормалізація розміру обєкта
        const halfWidth = (this.width / 2) / (canvas.width / 2);
        const halfHeight = (this.height / 2) / (canvas.height / 2);
    
        const normalizedX = ((this.x - camera.x) / (canvas.width / 2)) - 1;
        const normalizedY = ((this.y - camera.y) / (canvas.height / 2)) - 1;
        const normalizedZ = -this.z / 1000;

        const objVertices = [
            normalizedX + halfWidth, normalizedY + halfHeight, normalizedZ,
            normalizedX + halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX + halfWidth, normalizedY + halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY + halfHeight, normalizedZ
        ];

        return objVertices;
    }

    getcolor() {
        return this.color;
    }
}

class Enemy {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // listobj.push(this)
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        ctx.fillStyle = 'red';
        ctx.fillRect(screenX, screenY, this.width, this.height);
    }
}

class ClassLight {
    constructor(x, y, angle, range, intensity, beamCount, fov, lights, onplayer = false) {
        this.x = x; // Центр світла
        this.y = y;
        this.angle = angle; // Центральний кут світла
        this.range = range; // Дальність світла
        this.intensity = intensity; // Початкова сила світла
        this.beamCount = beamCount; // Кількість променів
        this.fov = fov; // Кут поля зору
        this.onplayer = onplayer; // Чи прив'язане світло до гравця
        lights.push(this);
    }
    
    draw(camera, playerAngle, player, worldObjects, debug = true) {



    }


}

class ClassDark {
    constructor(x, y, z, width, height, color, darkness){
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.color = color;
        this.strength = 1;
        darkness.push(this);
    }
    
    getVertices(canvas) {
        // Нормалізація розміру гравця
        const halfWidth = (this.width / 2) / (canvas.width / 2);
        const halfHeight = (this.height / 2) / (canvas.height / 2);

        // Нормалізація координат гравця
        const normalizedX = ((this.x) / (canvas.width / 2)) - 1;
        const normalizedY = ((this.y) / (canvas.height / 2)) - 1;
        const normalizedZ = -this.z / 1000;

        const triangleVertices = [
            normalizedX + halfWidth, normalizedY + halfHeight, normalizedZ,
            normalizedX + halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX + halfWidth, normalizedY + halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY - halfHeight, normalizedZ,
            normalizedX - halfWidth, normalizedY + halfHeight, normalizedZ
        ];

        return triangleVertices;
    }

    

}

function showError(errorText) {
    const errorBoxDiv = document.getElementById('ErrorMessage');
    const errorTextElement = document.getElementById('ErrorText');
    errorTextElement.innerText = errorText;
    console.log(errorText);
}

class Game {
    constructor() {
        // this.errorcontainer = document.getElementById('ErrorMessage');

        this.canvas = document.getElementById('myCanvas');
        if (!this.canvas) {
            showError('Canvas element not found!')
            return;
        }

        this.gl = this.canvas.getContext('webgl2')
        if (!this.gl) {
            showError('WebGL2 not supported on this browser or device.')
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1920;
        this.canvas.height = 1080;

        this.player = new ClassPlayer(0, 0, 500, 60, 40, [0.3, 0.6, 0.8, 1.0]);
        this.camera = { x: 0, y: 0 };
        this.keys = { up: false, down: false, left: false, right: false };

        this.objects = [];
        this.enemies = [];
        this.darkness = [];
        this.lights = [];
        this.bullets = [];
        this.world = [];
        this.lastTime = 0;

        this.mouse = { x: 0, y: 0 };

        this.setupKeyListeners();
        this.setupMouseListeners();

        this.buffers = {
            player: this.gl.createBuffer(),
            objects: this.gl.createBuffer(),
            enemies: this.gl.createBuffer(),
            darkness: this.gl.createBuffer(),
            lights: this.gl.createBuffer(),
            bullets: this.gl.createBuffer(),
            world: this.gl.createBuffer(),
        };
        this.shaderProgram = this.initializeShaders();

        this.createDarkField();
    }

    setupKeyListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'w') this.keys.up = true;
            if (event.key === 's') this.keys.down = true;
            if (event.key === 'a') this.keys.left = true;
            if (event.key === 'd') this.keys.right = true;
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'w') this.keys.up = false;
            if (event.key === 's') this.keys.down = false;
            if (event.key === 'a') this.keys.left = false;
            if (event.key === 'd') this.keys.right = false;
        });
    }

    setupMouseListeners() {
        this.mouse = { x: 0, y: 0 };
    
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) * this.canvas.width) / rect.width;
            this.mouse.y = ((event.clientY - rect.top) * this.canvas.height) / rect.height;
        });
    }

    createDarkField() {
        const squareSize = 50;
        
        for (let x = 0; x < this.canvas.width; x += squareSize) {
            for (let y = 0; y < this.canvas.height; y += squareSize) {
                new ClassDark(x, y, 3, squareSize, squareSize, [0.2, 0.2, 0.2, 1.0], this.darkness);
            }
        }
    }

    initializeShaders() {
        const vertexShaderSource = `#version 300 es
        precision mediump float;

        in vec3 vertexPosition;

        void main() {
            gl_Position = vec4(vertexPosition, 1.0);
        }`;

        const fragmentShaderSource = `#version 300 es
        precision mediump float;

        uniform vec4 uColor;

        out vec4 outputColor;

        void main() {
            outputColor = uColor;
        }`;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Shader program link error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    drawBuffer(buffer, color, vertexCount) {
        const gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        const vertexPositionAttribLocation = gl.getAttribLocation(this.shaderProgram, 'vertexPosition');
        gl.enableVertexAttribArray(vertexPositionAttribLocation);
        gl.vertexAttribPointer(vertexPositionAttribLocation, 3, gl.FLOAT, false, 0, 0);

        const uColorLocation = gl.getUniformLocation(this.shaderProgram, 'uColor');
        gl.uniform4fv(uColorLocation, color);

        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    updateBuffers() {
        const gl = this.gl;

        // Сортуємо всі об'єкти для оновлення буферів
        const updateObjects = [
            this.player,
            ...this.objects,
            // ...this.enemies,
            ...this.darkness,
            // ...this.lights,
            // ...this.bullets,
            // ...this.world,
        ];

        updateObjects.sort((a, b) => a.z - b.z);

        // Оновлюємо буфери для кожного об'єкта
        updateObjects.forEach((obj) => {
            const vertices = new Float32Array(obj.getVertices(this.canvas, this.camera));
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.objects); // Використовуємо один загальний буфер
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
        });
    }

    draw() {
        const gl = this.gl;
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        gl.useProgram(this.shaderProgram);
        gl.enable(gl.DEPTH_TEST); // Увімкнути тест глибини
        gl.depthFunc(gl.LESS);    // Малювати ближчі об'єкти поверх дальніх
        
        // Сортуємо всі об'єкти для рендерингу
        const renderObjects = [
            this.player,
            ...this.objects,
            // ...this.enemies,
            ...this.darkness,
            // ...this.lights,
            // ...this.bullets,
            // ...this.world,
        ];

        renderObjects.sort((a, b) => a.z - b.z);    

        renderObjects.forEach((obj) => {
            const vertices = new Float32Array(obj.getVertices(this.canvas, this.camera));
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.objects);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    
            this.drawBuffer(this.buffers.objects, obj.color, 6);
        });
    }

    drawObject(obj) {
        const vertices = new Float32Array(obj.getVertices(this.canvas, this.camera));
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.objects);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.DYNAMIC_DRAW);
        this.drawBuffer(this.buffers.objects, obj.color, 6);
    }

    animate(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.gl.clearColor(0.08, 0.08, 0.08, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.player.move(deltaTime, this.keys, this.camera);

        this.updateBuffers();
        this.draw();
        
        // gl.drawArrays(gl.TRIANGLES, 0, 6);
        // return 0;
        requestAnimationFrame(this.animate.bind(this));
    }

    start() {
        this.lastTime = performance.now();

        this.objects.push(new ClassObj(200, 100, 4, 50, 50, [0.5, 0.0, 0.8, 1.0], this.objects));
        this.objects.push(new ClassObj(100, 100, 1, 100, 10, [0.5, 0.9, 0.8, 1.0], this.objects));

        // new ClassObj(200, 800, 1000, 10, this.worldObjects);


        // // Створення світла, прикріпленого до гравця
        // new ClassLight(
        //     0,                  // Початкова X-координата (ігнорується, якщо onplayer = true)
        //     0,                  // Початкова Y-координата (ігнорується, якщо onplayer = true)
        //     0,
        //     1000,                // Радіус світла
        //     1,                  // Сила світла (від 0 до 1)
        //     100,                 // Кількість променів
        //     Math.PI / 3,        // Поле зору (в радіанах, тут 60°)
        //     this.worldObjects,       // Масив світла
        //     true                // Світло прив'язане до гравця
        // );

        // new ClassLight(
        //     0,                  // Початкова X-координата (ігнорується, якщо onplayer = true)
        //     0,                  // Початкова Y-координата (ігнорується, якщо onplayer = true)
        //     0,
        //     100,                // Радіус світла
        //     1,                  // Сила світла (від 0 до 1)
        //     20,                 // Кількість променів
        //     Math.PI * 2,        // Поле зору (в радіанах, тут 60°)
        //     this.worldObjects,       // Масив світла
        //     true                // Світло прив'язане до гравця
        // );

        // // Створення світла, яке не прив'язане до гравця
        // new ClassLight(
        //     400,                // X-координата
        //     300,                // Y-координата
        //     0,
        //     200,                // Радіус світла
        //     1,                // Сила світла
        //     20,                 // Кількість променів
        //     Math.PI * 2,        // Поле зору (в радіанах, тут 45°)
        //     this.worldObjects,       // Масив світла
        //     false               // Світло не прив'язане до гравця
        // );

        this.animate(this.lastTime);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
});