// PixiJS логіка
// Створюємо додаток
const app = new PIXI.Application({
    backgroundColor: 0x1099bb,
    resizeTo: window
});

// Додаємо canvas у документ
document.body.appendChild(app.view);

// Контейнер для об'єктів
const container = new PIXI.Container();
app.stage.addChild(container);

// Завантаження текстури
// const texture = PIXI.Texture.from('https://pixijs.com/assets/bunny.png');

// Створюємо спрайти
for (let i = 0; i < 25; i++) {
    const bunny = new PIXI.Sprite(texture);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
}

// Центруємо контейнер
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

// Анімація
app.ticker.add((delta) => {
    container.rotation -= 0.01 * delta;
});