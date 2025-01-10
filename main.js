class ClassPlayer {
    constructor(x, y, z, width, height, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        this.color = color;
        this.speed = 500;
        this.maxVelocity = 10;
    }

    getVertices(canvas, camera) {
        // Нормалізація розміру гравця
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        // Центр гравця (нормалізований)
        const normalizedX = ((this.x - camera.x) / (canvas.width / 2)) - 0;
        const normalizedY = ((this.y - camera.y) / (canvas.height / 2)) - 0;
        const normalizedZ = -this.z / 1000;

        // Обчислення обертання
        const angle = (this.rotation * Math.PI) / 180;
        const rotate = (x, y) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return {
                x: x * cos - y * sin,
                y: x * sin + y * cos,
            };
        };

        // Вершини квадрата до обертання
        const vertices = [
            { x: +halfWidth, y: +halfHeight }, // Верхній правий
            { x: +halfWidth, y: -halfHeight }, // Нижній правий
            { x: -halfWidth, y: -halfHeight }, // Нижній лівий
            { x: -halfWidth, y: +halfHeight }, // Верхній лівий
        ];

    
        const rotatedVertices = vertices.map(({ x, y }) => {
            const rotated = rotate(x, y);
            return [
                normalizedX + (rotated.x / (canvas.width / 2)),
                normalizedY + (rotated.y / (canvas.height / 2)),
                normalizedZ,
            ];
        });
    
        // Перетворення у формат для WebGL
        return [
            ...rotatedVertices[0], ...rotatedVertices[1], ...rotatedVertices[2],
            ...rotatedVertices[0], ...rotatedVertices[2], ...rotatedVertices[3],
        ];
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

    setAngleToCursor(canvas, mouse) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
    
        const deltaX = mouse.x - centerX;
        const deltaY = mouse.y - centerY;
        const angle = Math.atan2(-deltaY, deltaX);

        // Конвертація в діапазон 0–360 градусів
        this.rotation = (angle * 180 / Math.PI - 360) % 360;

        // console.log(`Mouse X: ${mouse.x}, Mouse Y: ${mouse.y}`);
        // console.log(`Center X: ${centerX}, Center Y: ${centerY}`);
        // console.log(`Delta X: ${deltaX}, Delta Y: ${deltaY}`);
        // console.log(`Angle (Radians): ${angle}`);
        // console.log(`Angle (Degrees): ${this.rotation}`);
    }
}

class ClassObj {
    constructor(x, y, z, width, height, color, objects, container){
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        this.color = color;
        objects.push(this);

        showPositions(this, container);
    }

    updateDomElement(canvas, camera) {
        if (this.domElement) {
            const screenX = ((this.x - camera.x) / (canvas.width / 2)) * canvas.width / 2;
            const screenY = ((this.y - camera.y) / (canvas.height / 2)) * canvas.height / 2;


            // Оновлюємо позицію div
            this.domElement.style.left = `${screenX - this.width}px`;
            this.domElement.style.bottom = `${screenY + this.height}px`;
            this.domElement.innerText = `(${Math.round(this.x)}, ${Math.round(this.y)} | ${Math.round(screenX)}, ${Math.round(screenY)})`;
        }
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
        this.x = -x; // Центр світла
        this.y = y;
        this.angle = angle; // Центральний кут світла
        this.range = range; // Дальність світла
        this.intensity = intensity; // Початкова сила світла
        this.beamCount = beamCount; // Кількість променів
        this.fov = fov; // Кут поля зору
        this.onplayer = onplayer; // Чи прив'язане світло до гравця
        this.color = [1.0, 1.0, 0.0, this.intensity];
        this.vertices = [];
        lights.push(this);
    }
    
    updatePosition(player) {
        if (this.onplayer) {
            this.x = player.x;
            this.y = player.y;
            this.angle = player.rotation * (Math.PI / 180); // Перетворення градусів у радіани
        }
    }

    generateVertices(canvas, camera) {
        const centerX = (this.x - camera.x) / (canvas.width / 2);
        const centerY = (this.y - camera.y) / (canvas.height / 2);
        
        const halfFov = this.fov / 2;
        const angleStart = this.angle - halfFov;
        const step = this.fov / (this.beamCount - 1);
        
        const thickness = 0.002; // Товщина променя в нормалізованих координатах
        
        // Очищуємо вершини перед генерацією
        this.vertices = [];
        
        for (let i = 0; i < this.beamCount; i++) {
            const currentAngle = angleStart + i * step;
        
            const beamX1 = centerX + Math.cos(currentAngle) * (this.range / (canvas.width / 2));
            const beamY1 = centerY + Math.sin(currentAngle) * (this.range / (canvas.height / 2));
        
            const beamX2 = beamX1 + Math.cos(currentAngle + Math.PI / 2) * thickness;
            const beamY2 = beamY1 + Math.sin(currentAngle + Math.PI / 2) * thickness;
        
            const beamX3 = beamX1 - Math.cos(currentAngle + Math.PI / 2) * thickness;
            const beamY3 = beamY1 - Math.sin(currentAngle + Math.PI / 2) * thickness;
        
            // Додаємо два трикутники для прямокутника
            this.vertices.push(
                centerX, centerY, -0.5,   // Центр
                beamX2, beamY2, -0.5,    // Перша вершина
                beamX1, beamY1, -0.5,    // Друга вершина
        
                centerX, centerY, -0.5,   // Центр
                beamX1, beamY1, -0.5,    // Третя вершина
                beamX3, beamY3, -0.5     // Четверта вершина
            );
        }
    }

    getVertices() {
        return this.vertices;
    }

    isSquareLit(square, canvas, camera) {
        const centerX = (this.x - camera.x) / (canvas.width / 2);
        const centerY = (this.y - camera.y) / (canvas.height / 2);
    
        // Координати квадрату в нормалізованій системі
        const squareLeft = (square.x - square.width / 2 - camera.x) / (canvas.width / 1);
        const squareRight = (square.x + square.width / 2 - camera.x) / (canvas.width / 1);
        const squareTop = (square.y + square.height / 2 - camera.y) / (canvas.height / 1);
        const squareBottom = (square.y - square.height / 2 - camera.y) / (canvas.height / 1);
    
        // Визначення відстані між центром світла і центром квадрату
        const dx = Math.max(squareLeft - centerX, 0, centerX - squareRight);
        const dy = Math.max(squareBottom - centerY, 0, centerY - squareTop);
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // Перевірка: квадрат знаходиться у межах радіуса світла
        return distance < this.range / (canvas.width / 1);
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

function showPositions(object, container) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    div.style.color = 'white';
    div.style.padding = '5px';
    div.style.borderRadius = '5px';
    div.style.fontSize = '12px';
    div.style.pointerEvents = 'none'; // Щоб не заважало клікам
    div.style.zIndex = '10';
    div.innerText = `(${Math.round(object.x)}, ${Math.round(object.y)})`;

    // Додаємо div у контейнер
    container.appendChild(div);

    // Зберігаємо div у об'єкті
    object.domElement = div;
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

        this.canvasContainer = document.getElementById('canvasContainer');

        // this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1920;
        this.canvas.height = 1080;

        this.player = new ClassPlayer(0, 0, 5, 60, 60, [0.3, 0.6, 0.8, 1.0]);
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

        this.setupMouseListeners();
        this.setupKeyListeners();
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
        console.log('setupMouseListeners initialized'); // Перевіряємо, чи виконується цей метод

        this.mouse = { x: 0, y: 0 };
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();

            this.mouse.x = ((event.clientX - rect.left) * this.canvas.width) / rect.width;
            this.mouse.y = ((event.clientY - rect.top) * this.canvas.height) / rect.height;

            // console.log(`Mouse move detected: X=${this.mouse.x}, Y=${this.mouse.y}`);
        });

    }

    createDarkField() {
        const squareSize = 10;
        
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

        // Перевіряємо, чи колір має правильний формат
        if (!Array.isArray(color) || color.length !== 4) {
            console.error('Invalid color array:', color);
            return;
        }

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
            ...this.lights,
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
        
        // Малювання світла
        this.lights.forEach(light => {
            const vertices = new Float32Array(light.getVertices());
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.lights);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
            
            this.drawBuffer(this.buffers.lights, light.color, vertices.length / 3);
        });

        const visibleDarkness = this.darkness.filter(square => {
            return !this.lights.some(light => light.isSquareLit(square, this.canvas, this.camera));
        });
    
        // Рендеримо тільки видимі квадрати
        visibleDarkness.forEach(darkSquare => {
            const vertices = new Float32Array(darkSquare.getVertices(this.canvas, this.camera));
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.darkness);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
            this.drawBuffer(this.buffers.darkness, darkSquare.color, 6);
        });

        // Сортуємо всі об'єкти для рендерингу
        const renderObjects = [
            this.player,
            ...this.objects,
            // ...this.enemies,
            // ...this.darkness,
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

        // Оновлення положення гравця
        this.player.move(deltaTime, this.keys, this.camera);

        // Оновлення повороту гравця
        this.player.setAngleToCursor(this.canvas, this.mouse);

        this.lights.forEach(light => {
            light.updatePosition(this.player);
            light.generateVertices(this.canvas, this.camera);
        });

        // Оновлення буферів
        this.updateBuffers();

        // Рендер сцени
        this.draw();

        this.updateObjects();

        requestAnimationFrame(this.animate.bind(this));
    }

    updateObjects() {
        this.objects.forEach((object) => object.updateDomElement(this.canvas, this.camera));
    }

    start() {
        this.lastTime = performance.now();

        this.objects.push(new ClassObj(400, 300, 4, 50, 50, [0.5, 0.0, 0.8, 1.0], this.objects, this.canvasContainer));
        this.objects.push(new ClassObj(100, 100, 4, 100, 10, [0.5, 0.9, 0.8, 1.0], this.objects, this.canvasContainer));

        // new ClassObj(200, 800, 1000, 10, this.worldObjects);


        // Створення світла, прикріпленого до гравця
        new ClassLight(
            0,                  // Початкова X-координата (ігнорується, якщо onplayer = true)
            0,                  // Початкова Y-координата (ігнорується, якщо onplayer = true)
            0,
            300,                // Радіус світла
            1.0,                  // Сила світла (від 0 до 1)
            50,                 // Кількість променів
            Math.PI / 2,        // Поле зору (в радіанах, тут 60°)
            this.lights,       // Масив світла
            true                // Світло прив'язане до гравця
        );

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

        // Створення світла, яке не прив'язане до гравця
        new ClassLight(
            400,                // X-координата
            300,                // Y-координата
            0,
            200,                // Радіус світла
            1.0,                // Сила світла
            20,                 // Кількість променів
            Math.PI * 2,        // Поле зору (в радіанах, тут 45°)
            this.lights,       // Масив світла
            false               // Світло не прив'язане до гравця
        );

        this.animate(this.lastTime);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
});