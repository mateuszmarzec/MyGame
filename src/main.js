var score;
var scoreText;

window.onload = function() {

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
  var ship;
  var velocity = 25;

  function preload() {
      game.load.image('background', 'assets/background.jpg');
      game.load.image('ship', 'assets/newstarship.png');
      game.load.image('asteroid', 'assets/asteroid.png');
      game.load.image('boom', 'assets/boom.png');
      game.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
      game.load.image('laser', 'assets/laser.png');
  }

  function create() {

    score = 0;
    game.add.sprite(0,0,'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ship = game.add.sprite(game.world.width/2,game.world.height/2,'ship');
    ship.scale.setTo(0.5,0.5);
    ship.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(ship);
    laser = game.add.weapon(30,'laser');
    laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    laser.physicsBodyType = Phaser.Physics.ARCADE;
    laser.trackSprite(ship, 0, 0, true);
    laser.bulletSpeed = 600;
    laser.fireRate = 100;

    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 12; i++)
    {
      var asteroid = asteroids.create(game.world.width*Math.random(),game.world.height*Math.random(), 'asteroid');
      asteroid.body.velocity.x =25 - 50*Math.random();
      asteroid.body.velocity.y =25 - 50*Math.random();
    }

    game.physics.arcade.enable(asteroids);
    ship.body.drag.set(70);
    ship.body.maxVelocity.set(400);

    Vel = game.add.bitmapText(game.world.width-220, 10, 'font','Velocity: '+ velocity,13);
    Score = game.add.bitmapText(10, 10, 'font','Score: '+ score,13);
    GameOver = game.add.bitmapText(game.world.width/2, game.world.height/2, 'font','',30);
    GameOver.anchor.setTo(0.5,0.5);
    Instuctions = game.add.bitmapText(10, game.world.height-50, 'font','Press p to pause \n\nPress ENTER to restart \n\nPress SPACE to start fire',8);

    asteroids.setAll('body.collideWorldBounds', true);
    asteroids.setAll('body.bounce.x', 1);
    asteroids.setAll('body.bounce.y', 1);
}
  function togglePause() {
      game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
  }


  function update() {

    game.physics.arcade.collide(asteroids);
    var cursors = game.input.keyboard.createCursorKeys();
    var restartButton = this.input.keyboard.addKey(Phaser.KeyCode.ENTER);
    var fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    PauseKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
    PauseKey.onDown.add(togglePause, this);

      if (cursors.up.isDown)
      {
          game.physics.arcade.accelerationFromRotation(ship.rotation, 300, ship.body.acceleration);
      }
      else
      {
          ship.body.acceleration.set(0);
      }

      if (cursors.left.isDown)
      {
          ship.body.angularVelocity = -300;
      }
      else if (cursors.right.isDown)
      {
          ship.body.angularVelocity = 300;
      }
      else
      {
          ship.body.angularVelocity = 0;
      }
      if (restartButton.isDown)
      {
          game.state.restart();
      }
      if (fireButton.isDown) {
          laser.fire();
      }
      game.world.wrap(ship);
      game.world.wrap(asteroids);

      game.physics.arcade.overlap(ship, asteroids, destroyShip, null, this);
      game.physics.arcade.overlap(laser.bullets, asteroids, destroyAsteroids, null, this);

      velocity = Math.sqrt(Math.abs(((ship.body.velocity.x)^2 + (ship.body.velocity.y)^2)));
      velocity = velocity.toPrecision(2);
      Vel.text = 'Velocity: ' + velocity;
  }

};
function destroyShip(ship,asteroid) {
    ship.loadTexture('boom');
    ship.scale.setTo(3,3);
    ship.body.enable = false;
    GameOver.text = 'Game Over!';
}
function destroyAsteroids(laser,asteroid) {
    asteroid.kill();
    score+=10;
    Score.text = 'Score: ' + score;

}
