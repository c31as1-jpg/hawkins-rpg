const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 960;
canvas.height = 640;

const TILE_SIZE = 32;


// BIG MAP
const map = [];

for(let y = 0; y < 50; y++) {

    let row = [];

    for(let x = 0; x < 50; x++) {

        // OUTER WALLS
        if(
            x === 0 ||
            y === 0 ||
            x === 49 ||
            y === 49
        ) {
            row.push(1);
        }

        // ROAD
        else if(y === 25) {
            row.push(2);
        }

        // TREES
        else if(
            (x === 10 && y > 5 && y < 20) ||
            (x === 11 && y > 5 && y < 20) ||
            (x === 30 && y > 10 && y < 35)
        ) {
            row.push(3);
        }

        // HOUSE
        else if(
            x > 18 &&
            x < 24 &&
            y > 10 &&
            y < 16
        ) {
            row.push(4);
        }

        // GRASS
        else {
            row.push(0);
        }
    }

    map.push(row);
}
// PLAYER
const player = {
    x: 200,
    y: 200,
    width: 28,
    height: 28,
    speed: 4,
    color: "cyan"
};

// NPC
const npc = {
    x: 700,
    y: 400,
    width: 28,
    height: 28,
    color: "yellow",
    message: "Something strange is happening in Hawkins..."
};

let showDialogue = false;

// CAMERA
const camera = {
    x: 0,
    y: 0
};

// KEYS
const keys = {};

window.addEventListener("keydown", function(e) {

    if([
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
    ].includes(e.key)) {
        e.preventDefault();
    }

    keys[e.key] = true;

    // INTERACT
    if(e.key === "e") {

        let dx = player.x - npc.x;
        let dy = player.y - npc.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < 80) {
            showDialogue = !showDialogue;
        }
    }
});

window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
});

// COLLISION
function isColliding(x, y) {

    let tileX = Math.floor(x / TILE_SIZE);
    let tileY = Math.floor(y / TILE_SIZE);

    if (
        tileX < 0 ||
        tileY < 0 ||
        tileY >= map.length ||
        tileX >= map[0].length
    ) {
        return true;
    }

    return map[tileY][tileX] === 1;
}

// UPDATE
function update() {

    let nextX = player.x;
    let nextY = player.y;

    if (keys["ArrowUp"]) nextY -= player.speed;
    if (keys["ArrowDown"]) nextY += player.speed;
    if (keys["ArrowLeft"]) nextX -= player.speed;
    if (keys["ArrowRight"]) nextX += player.speed;

    if (!isColliding(nextX, player.y)) {
        player.x = nextX;
    }

    if (!isColliding(player.x, nextY)) {
        player.y = nextY;
    }

    // CAMERA FOLLOWS PLAYER
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
}

// DRAW MAP
function drawMap() {

    for(let y = 0; y < map.length; y++) {

        for(let x = 0; x < map[y].length; x++) {

            if(map[y][x] === 1) {
                ctx.fillStyle = "#333";
            } else {
                ctx.fillStyle = "#111";
            }

            ctx.fillRect(
                x * TILE_SIZE - camera.x,
                y * TILE_SIZE - camera.y,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    }
}

// DRAW PLAYER
function drawPlayer() {

    ctx.fillStyle = player.color;

    ctx.fillRect(
        player.x - camera.x,
        player.y - camera.y,
        player.width,
        player.height
    );
}

// DRAW NPC
function drawNPC() {

    ctx.fillStyle = npc.color;

    ctx.fillRect(
        npc.x - camera.x,
        npc.y - camera.y,
        npc.width,
        npc.height
    );
}

// DRAW DIALOGUE
function drawDialogue() {

    if(!showDialogue) return;

    ctx.fillStyle = "black";
    ctx.fillRect(100, 500, 760, 100);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 500, 760, 100);

    ctx.fillStyle = "white";
    ctx.font = "20px monospace";

    ctx.fillText(
        npc.message,
        120,
        555
    );

    ctx.fillText(
        "Press E to close",
        120,
        585
    );
}

// DRAW
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawNPC();
    drawPlayer();
    drawDialogue();
}

// LOOP
function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
