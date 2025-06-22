
let jogoIniciado = false;

// Variáveis do jogo
let jogador;
let alfaces = [];
let pontuacao = 0;
let tempoTotal = 60; // segundos
let tempoRestante;
let tempoInicial;

let reiniciarBtn;

function setup() {
  createCanvas(600, 400);

  // Criar botão de reiniciar)
  reiniciarBtn = createButton('Reiniciar');
  reiniciarBtn.position(width / 2 - 40, height / 2 + 40);
  reiniciarBtn.size(80, 40);
  reiniciarBtn.style('font-size', '18px');
  reiniciarBtn.style('background-color', '#4CAF50');
  reiniciarBtn.style('color', 'white');
  reiniciarBtn.style('border', 'none');
  reiniciarBtn.style('border-radius', '8px');
  reiniciarBtn.hide();
  reiniciarBtn.mousePressed(reiniciarJogo);
}

function draw() {
  if (!jogoIniciado) {
    mostrarTelaInicial();
  } else {
    rodarJogo();
  }
}

function mousePressed() {
  if (!jogoIniciado) {
    iniciarJogo();
  }
}

// =========== Tela Inicial ===========

function mostrarTelaInicial() {
  background("#1ec3ea");

  fill("orange");
  circle(195, 260, 100);

  fill("green");
  rect(104, 20, 190, 230);

  fill("yellow");
  triangle(300, 10, 100, 10, 200, 200);

  fill("blue");
  circle(200, 25, 105);

  // texto principal
  fill("white");
  textSize(40);
  text("AGRINHO", 105, 250);

  fill("black");
  textSize(25);
  text("2025", 167, 280);

  fill("white");
  textSize(27);
  text("Pressione o mouse na tela para começar !", 50, 380);

  // instruções no lado direito
  fill("red");
  textSize(13);
  textAlign(LEFT);
  text("Instruções:", width * 0.6, 100);
  text("Use as setas ← ↑ ↓ → para mover", width * 0.6, 130);
  text("Pegue os alfaces e leve até a cidade →", width * 0.6, 160);
  text("Você tem 60 segundos para coletar", width * 0.6, 190);
  text("o máximo de alfaces possível!", width * 0.6, 210);
}

// =========== Jogo ===========

function iniciarJogo() {
  jogoIniciado = true;
  jogador = new Jogador();
  alfaces = [];
  criarAlfaces(5);
  pontuacao = 0;
  tempoInicial = millis();
  tempoRestante = tempoTotal;
  reiniciarBtn.hide();
  loop();
}

function rodarJogo() {
  background(220);
  desenharCenario();

  jogador.mover();
  jogador.mostrar();

  for (let alface of alfaces) {
    if (!alface.coletada) {
      alface.mostrar();

      if (jogador.coletar(alface)) {
        alface.coletada = true;
      }
    }
  }

  // entrega
  if (jogador.x > width / 2) {
    let entreguesAgora = 0;
    for (let a of alfaces) {
      if (a.coletada && !a.entregue) {
        a.entregue = true;
        entreguesAgora++;
      }
    }
    pontuacao += entreguesAgora;

    if (entreguesAgora > 0) {
      criarAlfaces(entreguesAgora); // novos alfaces surgem
    }
  }

  // Tempo
  let tempoPassado = (millis() - tempoInicial) / 1000;
  tempoRestante = max(0, floor(tempoTotal - tempoPassado));

  desenharHUD();

  if (tempoRestante <= 0) {
    noLoop();
    mostrarFim();
    reiniciarBtn.show();
  }
}

function desenharCenario() {
  // Campo (esquerdo)
  fill(139, 69, 19);
  rect(0, 0, width / 2, height);

  // Cidade (direita)
  fill(200);
  rect(width / 2, 0, width / 2, height);

  // Calçada
  fill(220);
  rect(width / 2, height - 40, width / 2, 40);

  // Casas
  drawCasa(320, 80);
  drawCasa(460, 130);
  drawCasa(390, 230);

  // Árvores
  drawArvore(350, 330);
  drawArvore(500, 290);

  // Poste
  fill(100);
  rect(550, 100, 8, 100);
  fill(255, 255, 150);
  ellipse(554, 95, 20, 20);

  // Linha divisória
  stroke(0);
  line(width / 2, 0, width / 2, height);
  noStroke();

  // Texto 
  textSize(18);
  fill(0, 200);
  textAlign(CENTER);
  text("CAMPO", width / 4, height - 10);
  text("CIDADE", width * 0.75, height - 10);
}

function desenharHUD() {
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("Use as setas ← ↑ ↓ → para mover", 10, 20);
  text("Pegue os alfaces e leve até a cidade →", 10, 40);
  text("Tempo: " + tempoRestante + "s", 10, 60);
  text("Entregas: " + pontuacao, 10, 80);
}

function mostrarFim() {
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("⏰ Tempo esgotado!", width / 2, height / 2 - 20);
  textSize(24);
  text("Total de alfaces entregues: " + pontuacao, width / 2, height / 2 + 20);
}

function criarAlfaces(qtd) {
  for (let i = 0; i < qtd; i++) {
    alfaces.push(new Alface());
  }
}

function reiniciarJogo() {
  pontuacao = 0;
  alfaces = [];
  criarAlfaces(5);
  tempoInicial = millis();
  tempoRestante = tempoTotal;
  jogador.x = 100;
  jogador.y = height / 2;
  loop();
  reiniciarBtn.hide();
}

// ==== CLASSES ====

class Jogador {
  constructor() {
    this.x = 100;
    this.y = height / 2;
    this.r = 15;
    this.vel = 3;
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.vel;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.vel;
    if (keyIsDown(UP_ARROW)) this.y -= this.vel;
    if (keyIsDown(DOWN_ARROW)) this.y += this.vel;

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  mostrar() {
    fill(0, 150, 255);
    ellipse(this.x, this.y, this.r * 2);
  }

  coletar(alface) {
    let d = dist(this.x, this.y, alface.x, alface.y);
    return d < this.r + alface.r;
  }
}

class Alface {
  constructor() {
    this.x = random(20, width / 2 - 20);
    this.y = random(20, height - 20);
    this.r = 10;
    this.coletada = false;
    this.entregue = false;
  }

  mostrar() {
    if (!this.entregue) {
      fill(this.coletada ? 200 : 0, 255, 100);
      ellipse(this.x, this.y, this.r * 2);
    }
  }
}

// ==== DETALHES ====

function drawCasa(x, y) {
  fill(180, 60, 60); // corpo
  rect(x, y, 60, 50);
  fill(150, 30, 30); // telhado
  triangle(x, y, x + 30, y - 25, x + 60, y);
  fill(100, 50, 0); // porta
  rect(x + 22, y + 25, 16, 25);
  fill(255); // janelas
  rect(x + 5, y + 10, 12, 12);
  rect(x + 43, y + 10, 12, 12);
}

function drawArvore(x, y) {
  fill(101, 67, 33); // tronco
  rect(x - 5, y, 10, 30);
  fill(34, 139, 34); // copa
  ellipse(x, y - 10, 40, 40);
}
