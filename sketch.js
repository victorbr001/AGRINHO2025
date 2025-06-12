function setup() {
  createCanvas(400, 400);
}

function draw() {
  background("#1ec3ea");
  
  fill("orange")
  circle(195,260,100);  
  
  fill("green");
 rect(104,20,190,230);
  
  fill("yellow");
  triangle(300,10,100,10,200,200);
  
  fill("blue");
  circle(200,25,105);
  //celebrando a conexão do campo com a cidade.
  
  let palavra = "AGRINHO";
  fill("white");
  textSize(40);
  text(palavra,105,250 );

  let palavra1 = "2025";
fill("black");
  textSize(25);
  text(palavra1,167,280);
  
  let palavra3 = "aperte espaço para começar" ;
  fill ("white");
  text(palavra3, 30,380);
  
  
  
  
}
