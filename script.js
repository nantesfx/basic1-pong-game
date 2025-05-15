let canvas = document.getElementById("meucanvas");
let ctx = canvas.getContext("2d");
let scoreDisplay = document.getElementById("score");

// Imagens do Player, oponente e bola.
let playerPaddleImg = new Image();
playerPaddleImg.src = "paddle.png"; 
let aiPaddleImg = new Image();
aiPaddleImg.src = "paddleIA.png";
let ballImg = new Image();
ballImg.src = "ball.png";

// Objetos
let player = {
    x: 350,
    y: canvas.height - 50,
    width: 100,
    height: 20,
    speed: 8,
    score: 0
};

let ai = {
    x: 350,
    y: 30,
    width: 100,
    height: 20,
    speed: 9,
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    speedX: 5,
    speedY: -5,
    speed: 7
};

// Controlar o Player.
canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect();
    let cX = event.clientX - rect.left;
    player.x = cX - player.width / 2;
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
});

// Prevenir cliques acidentais.
canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

// Resetar a bola após o gol.
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.speedY = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

// Atualização constante do jogo
function update() {
    // Movimentação da bola
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Colisão da bola, esta meio bugado ainda
    if (ball.y <= 0) {
        player.score++;
        updateScore();
        resetBall();
    } else if (ball.y + ball.height >= canvas.height) {
        ai.score++;
        updateScore();
        resetBall();
    }

    // Colisao da bola com as paredes
    if (ball.x <= 0 || ball.x + ball.width >= canvas.width) {
        ball.speedX = -ball.speedX;
    }

    // Colisao da bola com o player
    if (
        ball.y + ball.height >= player.y &&
        ball.x + ball.width >= player.x &&
        ball.x <= player.x + player.width
    ) {
        ball.speedY = -Math.abs(ball.speedY);
        ball.speedX += (ball.x - (player.x + player.width / 2)) * 0.1;
    }
    if (
        ball.y <= ai.y + ai.height &&
        ball.x + ball.width >= ai.x &&
        ball.x <= ai.x + ai.width
    ) {
        ball.speedY = Math.abs(ball.speedY);
        ball.speedX += (ball.x - (ai.x + ai.width / 2)) * 0.1;
    }

    // Movimentação do oponente
    let targetX = ball.x - ai.width / 2; // Target ball's center
    ai.x += (targetX - ai.x) * 0.3; // Increased from 0.1 to 0.2 for more aggressive tracking
    ai.x = Math.max(0, Math.min(ai.x, canvas.width - ai.width));

    // Placar
    function updateScore() {
        scoreDisplay.textContent = `Player: ${player.score} | AI: ${ai.score}`;
    }
}

// Desenhar jogo
function draw() {
    // Limpa o canva
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Meio de campo
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.setLineDash([]);

    // Jogador com brilho verde
    ctx.shadowColor = "green";
    ctx.shadowBlur = 20;
    if (playerPaddleImg.complete && playerPaddleImg.naturalWidth !== 0) {
        ctx.drawImage(playerPaddleImg, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    ctx.shadowBlur = 0;

    // Oponente com brilho rosa
    ctx.shadowColor = "pink";
    ctx.shadowBlur = 20;
    if (aiPaddleImg.complete && aiPaddleImg.naturalWidth !== 0) {
        ctx.drawImage(aiPaddleImg, ai.x, ai.y, ai.width, ai.height);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(ai.x, ai.y, ai.width, ai.height);
    }
    ctx.shadowBlur = 0; // Reset glow

    // Bola redonda
    ctx.shadowColor = "orange";
    ctx.shadowBlur = 20;
    if (ballImg.complete && ballImg.naturalWidth !== 0) {
        ctx.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height);
    } else {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ball.x + ball.width / 2, ball.y + ball.height / 2, ball.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Loop do game pra funcionar
function gameLoop() {
    update();
    draw();
}

// Rodar sem travar
setInterval(gameLoop, 1000 / 60);