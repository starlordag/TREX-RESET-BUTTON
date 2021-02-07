var PLAY = 1;
var END = 0;
var gameState = PLAY;
var x = 0
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
var restartButton;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth,displayHeight);

  restartButton = createButton("Restart Game")
  restartButton.position(displayHeight/2+360,displayWidth/2-680);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(-300,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle", 0,0,trex.width*4,trex.height);
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //displaying score
  text("Score: "+ score, 500,50);

  restartButton.mousePressed(()=>{
    gameState = PLAY;
    score = 0;
    frameCount = 0;
    trex.changeAnimation("running", trex_running);
    for(var obs in obstaclesGroup){
      if(obstaclesGroup[obs] !== undefined)
      {
      obstaclesGroup[obs].visible = false;
      //obstaclesGroup[obs].destroy();
      }
    }
    for(var cloudsIMG in cloudsGroup){
      if(cloudsGroup[cloudsIMG] !== undefined)
      {
      cloudsGroup[cloudsIMG].visible = false;     
      //cloudsGroup[cloudsIMG].destroy();
      }
    }
    obstaclesGroup.clear();
    cloudsGroup.clear();
    obstaclesGroup.destroy();
    cloudsGroup.destroy();
   
  });
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(6 + score/100);
    image(groundImage,-displayHeight*30,displayWidth,displayHeight*31)

    //moving camera (new)
    camera.position.x=trex.x;

    //scoring
    score = score + Math.round(frameCount/300);
    
    if(score>0 && score % 100 === 0){
      checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = (ground.width/2)-700;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 159.9) {
      trex.velocityY = -12;
    }
  
    if(keyWentUp("space")){
      jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(score>500){
      trex.setCollider("rectangle", 0,0,trex.width,trex.height*2)
    }
    
    if(obstaclesGroup.isTouching(trex)){
      if(score<500){
        trex.velocityY = -12
        jumpSound.play();
      }
      else{
        gameState = END;
        dieSound.play();
      }
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0

      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth+20,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(displayWidth+20,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(5.7 + score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
