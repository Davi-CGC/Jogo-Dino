//bord /A area de jogo onde tudo será desenhdo.
let board;
let boardWidth = 750; //Largura
let boardHeight = 250; //Altura
let context;// declara a variavel context que sera usada para desenhar elementos

//dino / o personagem principal do jogo que pode saltar para evitar obstaculos
let dinoWidth = 88; //lagura do dino
let dinoHeight = 94; // altura do dino
let dinoX = 50; // posição original do dinossauro na horizontal 50 pixels a direita da borda esquerda
let dinoY = boardHeight - dinoHeight; // posição original do dino na vertical que faz ele ficar no chão
let dinoImg; //declara a variavel da imagem do dino ou seja salva a imagem

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

// cactos /obstaculos que são gerados aleatoriamente que se movem para aa esquerda 
let cactusArray = []; // Um Array vazio é criado para amarzenar os cactos que vão aparecer 

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70; // altura de todos os cactus stem a mesma altura de 70 pixels 
let cactusX = 700; // os cactus começão na posição horizontal 700 longe do dinossauro 
let cactusY = boardHeight - cactusHeight; // posição que faz os cactus ficarem no chão

let cactus1Img;
let cactus2Img; // declara as imagens dos três cactus 
let cactus3Img;

//physics
let velocityX = -8; //velocidade horizontal 
let velocityY = 0; // não tem velocidade vertical
let gravity = .4; // coloc gravida fazendo assim o dino voltar para o chão apos pular 

let gameOver = false // indica que o jogo ainda não acabou 
let score = 0; // inicia a pontuação em 0

window.onload = function() {
    board = document.getElementById("board"); // esse trecho executa quando a pagina atualiza 
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //usado para desenhar no quadro 

    //desenhe o dinossauro inicial
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image(); // cria um novo objeto image
    dinoImg.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/dino.png?raw=true&quot";
    dinoImg.onload = function() { //a função onload garante que a imagem apareça.
        context.drawImage (dinoImg, dino.x, dino.y, dino.width, dino.height);
     } //a função drawImage () desenha o dino nas cordenadas dino.x e dino.y

     cactus1Img = new Image();
     cactus1Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus1.png?raw=true";

     cactus2Img = new Image();
     cactus2Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus2.png?raw=true";

     cactus3Img = new Image();
     cactus3Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus3.png?raw=true";

     requestAnimationFrame(update); //inicio do loop de atualização

     setInterval(placeCactus, 1000); // da o intervalo para aparecer os cactus
     document.addEventListener("keydown", moveDino); // adiciona o evento do teclado
}

function update() { // dá um chamado para manter o jogo funcionando
    requestAnimationFrame(update); // essa função cha a proxima atualização
    if (gameOver) { //se gameOver for true o jogo para e não continua atualizando
        return;
    }
context.clearRect(0, 0, board.width, board.height);
//dino
velocityY += gravity; //a variavel velocity controla a velocidade vertical
dino.y = Math.min(dino.y + velocityY, dinoY);
context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

//cactus
for (let i = 0; i < cactusArray.length; i++) {
let cactus = cactusArray[i];
cactus.x += velocityX;
context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

if (detectCollision(dino, cactus)) {
    gameOver = true;
    dinoImg.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/dino-dead.png?raw=true&quot";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)
        }
    }
}

//score
context.fillStyle="black";// cor do texto
context.font="20px courier";// tamanho e fonte do texto
score++; // a pontuação é incrementada em 1 a cada atualização do jogo
context.fillText(score, 5, 20); // exibe o valor atual da pontuação no Canva

}

function moveDino(e) { // essa função é chamada quando um atecla é presionada e controla o dino
    if (gameOver) { // se o jogo acabou o gameOver é true 

        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {

        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null, // começa com null pois nenhuma image foi definida
        x : cactusX, // posiciona o cacto na extremidade direita da tela 
        y : cactusY, // garante que o cacto fique no chão
        width : null, // também começa como null pois será definida depois 
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); 

    if (placeCactusChance > .90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
     else if (placeCactusChance > .50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.legth > 5) {
        cactusArray.shift(); 
    }
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }