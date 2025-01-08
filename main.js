// const canvas = document.getElementById("myCanvas")
// canvas.width = 1920;
// canvas.height = 1080;
// const ctx = canvas.getContext('2d');
// let worldObjects = [];
// let player = null;
// let right = false, left = false, up = false, down = false;
// let lastTime = 0;

// const camera = {
//     x: 0,
//     y: 0,
// };

class ClassPlayer {
    constructor(x, y, width, height, ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 1000;
        this.maxVelocity = 10;
    }

    draw(ctx, canvas, mouse) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
    
        ctx.save();
    
        // Перехід до центру гравця
        ctx.translate(centerX, centerY);
    
        // Обчислення кута до курсора
        const angle = this.getAngleToCursor(mouse, canvas);
    
        // Поворот гравця
        ctx.rotate(angle);
    
        // Малювання гравця
        ctx.fillStyle = 'blue';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
        ctx.restore();
    }

    move(deltaTime, keys, camera) {
        let dx = 0;
        let dy = 0;

        if (keys.up) dy -= this.speed * deltaTime;
        if (keys.down) dy += this.speed * deltaTime;
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
    constructor(x, y, width, height, worldObjects){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        worldObjects.push(this);
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        ctx.fillStyle = 'orange';
        ctx.fillRect(screenX, screenY, this.width, this.height);
    }
}

class ClassEmpty {
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
    constructor(x, y, angle, range, intensity, beamCount, fov, worldObjects, onplayer = false) {
        this.x = x; // Центр світла
        this.y = y;
        this.angle = angle; // Центральний кут світла
        this.range = range; // Дальність світла
        this.intensity = intensity; // Початкова сила світла
        this.beamCount = beamCount; // Кількість променів
        this.fov = fov; // Кут поля зору
        this.onplayer = onplayer; // Чи прив'язане світло до гравця
        worldObjects.push(this);
    }
    
    draw(ctx, camera, playerAngle, player, debug = true) {
        ctx.save();

        // Визначаємо центр світла
        const centerX = this.onplayer ? player.x - camera.x + ctx.canvas.width / 2 : this.x - camera.x;
        const centerY = this.onplayer ? player.y - camera.y + ctx.canvas.height / 2 : this.y - camera.y;

        // Малюємо промені
        const halfFov = this.fov / 2;
        const angleStart = (this.angle - halfFov) + (this.onplayer ? playerAngle : 0);
        const step = this.fov / (this.beamCount - 1);

        for (let i = 0; i < this.beamCount; i++) {
            const currentAngle = angleStart + i * step;
            const sinAngle = Math.sin(currentAngle);
            const cosAngle = Math.cos(currentAngle);

            const endX = centerX + cosAngle * this.range;
            const endY = centerY + sinAngle * this.range;

            if (debug) {
                ctx.strokeStyle = `rgba(255, 251, 0, ${this.intensity})`;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    getLightPolygon(player, playerAngle, camera, canvas) {
        const centerX = this.onplayer ? canvas.width / 2 : this.x - camera.x;
        const centerY = this.onplayer ? canvas.height / 2 : this.y - camera.y;

        const halfFov = this.fov / 2;
        const angleStart = (this.angle - halfFov) + (this.onplayer ? playerAngle : 0);
        const angleEnd = angleStart + this.fov;

        const polygon = [{ x: centerX, y: centerY }];

        for (let currentAngle = angleStart; currentAngle <= angleEnd; currentAngle += this.fov / this.beamCount) {
            const sinAngle = Math.sin(currentAngle);
            const cosAngle = Math.cos(currentAngle);

            polygon.push({
                x: centerX + cosAngle * this.range,
                y: centerY + sinAngle * this.range,
            });
        }

        return polygon;
    }
}

class ClassDark {
    constructor(x, y, width, height, worldDarkLight){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.strength = 1;
        // worldObjects.push(this);
        worldDarkLight.push(this);
    }
    
    draw(ctx, camera) {
        const screenX = this.x;
        const screenY = this.y;
        ctx.fillStyle = `rgba(0, 0, 0, ${this.strength})`;
        ctx.fillRect(screenX, screenY, this.width, this.height);
    }

    checkCollision(lightPolygon) {
        const corners = [
            { x: this.x, y: this.y },
            { x: this.x + this.width, y: this.y },
            { x: this.x + this.width, y: this.y + this.height },
            { x: this.x, y: this.y + this.height },
        ];

        // Перевірка перетину полігону світла з полігоном темряви (SAT)
        return this.satCollision(corners, lightPolygon);
    }

    satCollision(polygon1, polygon2) {
        const getAxes = (polygon) => {
            const axes = [];
            for (let i = 0; i < polygon.length; i++) {
                const p1 = polygon[i];
                const p2 = polygon[(i + 1) % polygon.length];
                const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
                const normal = { x: -edge.y, y: edge.x };
                const magnitude = Math.sqrt(normal.x ** 2 + normal.y ** 2);
                axes.push({ x: normal.x / magnitude, y: normal.y / magnitude });
            }
            return axes;
        };

        const projectPolygon = (polygon, axis) => {
            let min = Infinity;
            let max = -Infinity;
            for (const point of polygon) {
                const projection = point.x * axis.x + point.y * axis.y;
                min = Math.min(min, projection);
                max = Math.max(max, projection);
            }
            return { min, max };
        };

        const overlap = (projection1, projection2) =>
            !(projection1.max < projection2.min || projection2.max < projection1.min);

        const axes1 = getAxes(polygon1);
        const axes2 = getAxes(polygon2);

        for (const axis of [...axes1, ...axes2]) {
            const projection1 = projectPolygon(polygon1, axis);
            const projection2 = projectPolygon(polygon2, axis);
            if (!overlap(projection1, projection2)) return false;
        }

        return true;
    }

}

class Game {
    constructor() {
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1920;
        this.canvas.height = 1080;

        this.player = new ClassPlayer(0, 0, 200, 100);
        this.camera = { x: 0, y: 0 };
        this.keys = { up: false, down: false, left: false, right: false };

        this.worldObjects = [];
        this.worldDarkLight = [];
        this.lastTime = 0;

        this.mouse = { x: 0, y: 0 };

        this.setupKeyListeners();
        this.setupMouseListeners();
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
        const squareSize = 15;
        for (let x = 0; x < this.canvas.width; x += squareSize) {
            for (let y = 0; y < this.canvas.height; y += squareSize) {
                new ClassDark(x, y, squareSize, squareSize, this.worldDarkLight);
            }
        }
    }

    animate(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.move(deltaTime, this.keys, this.camera);
        const playerAngle = this.player.getAngleToCursor(this.mouse, this.canvas);

        const lightPolygons = this.worldObjects
            .filter((obj) => obj instanceof ClassLight)
            .map((light) => light.getLightPolygon(this.player, playerAngle, this.camera, this.canvas));

        

        for (const obj of this.worldObjects) {
            obj.draw(this.ctx, this.camera, playerAngle, this.player);
        }

        for (const dark of this.worldDarkLight) {
            let affectedByLight = false;
    
            for (const lightPolygon of lightPolygons) {
                if (dark.checkCollision(lightPolygon)) {
                    dark.strength -= 20 * deltaTime;
                    dark.strength = Math.max(0, dark.strength);
                    affectedByLight = true;
                    break;
                }
            }
    
            if (!affectedByLight) {
                dark.strength += 10 * deltaTime;
                dark.strength = Math.min(1, dark.strength);
            }
    
            dark.draw(this.ctx, this.camera);
        }

        this.player.draw(this.ctx, this.canvas, this.mouse);

        requestAnimationFrame(this.animate.bind(this));
    }

    start() {
        this.lastTime = performance.now();

        new ClassObj(100, 100, 50, 50, this.worldObjects);

        // Створення світла, прикріпленого до гравця
        new ClassLight(
            0,                  // Початкова X-координата (ігнорується, якщо onplayer = true)
            0,                  // Початкова Y-координата (ігнорується, якщо onplayer = true)
            0,
            500,                // Радіус світла
            1,                  // Сила світла (від 0 до 1)
            20,                 // Кількість променів
            Math.PI / 3,        // Поле зору (в радіанах, тут 60°)
            this.worldObjects,       // Масив світла
            true                // Світло прив'язане до гравця
        );

        // Створення світла, яке не прив'язане до гравця
        new ClassLight(
            400,                // X-координата
            300,                // Y-координата
            0,
            200,                // Радіус світла
            0.2,                // Сила світла
            20,                 // Кількість променів
            Math.PI * 2,        // Поле зору (в радіанах, тут 45°)
            this.worldObjects,       // Масив світла
            false               // Світло не прив'язане до гравця
        );

        this.animate(this.lastTime);
    }
}

const game = new Game();
game.start();