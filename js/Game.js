var SideScroller = SideScroller || {};

SideScroller.Game = function(){};

var direction = 'right',
    reiniciar = false;

SideScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
      this.game.stage.backgroundColor = '#079bc3';
    },
  create: function() {
    var newItem;
    direction = 'right',
    reiniciar = false;

    var style = { font: "40px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 100};
    this.tiempo = this.game.add.text(60, 70, "60", style);
    this.tiempo.anchor.set(0.5);
    this.game.time.events.add(Phaser.Timer.SECOND * 60, this.finDelJuego, this);

    fondo = this.game.add.tileSprite( this.game.world.width/2, 100, 300, 162, 'fondo'); 

    this.map = this.game.add.tilemap('map');
    this.layer = this.map.createLayer('Tile Layer 1');
    //this.layer = this.map.createLayer('LayerUno');
    this.map.setCollisionBetween(1, 12)
    //this.map.setCollisionBetween(57, 60);
    this.map.addTilesetImage('ground_1x1');
    this.map.addTilesetImage('walls_1x2');
    this.map.addTilesetImage('tiles2');
    this.map.addTilesetImage('paquete');
    //this.map.addTilesetImage('kenney', 'tiles');

    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    //this.layer = this.map.createLayer('World1');

    //  This resizes the game world to match the layer dimensions
    this.layer.resizeWorld();
    

    this.coins = this.game.add.group();
    this.coins.enableBody = true;

    this.paquetes = this.game.add.group();
    this.paquetes.enableBody = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, this.coins);
    this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    this.coins.callAll('animations.play', 'animations', 'spin');
    this.map.createFromObjects('Object Layer 1', 196, 'paquete', 0, true, false, this.paquetes);
    
    //game params
    this.levelSpeed = -250;
    this.tileSize = 70;
    this.probCliff = 0.4;
    this.probVertical = 0.4;
    this.probMoreVertical = 0.5;


    //create player
    this.player = this.game.add.sprite(20, 20, 'menRun');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('walk');
    this.player.animations.play('walk',30,true);
    this.player.animations.add('wait', [4], 10, true);
    // /this.player.scale.setTo(0.8);

    //enable physics on the player
    this.game.physics.arcade.enable(this.player,true);

    //player gravity
    this.player.body.gravity.y = 700;
    this.player.body.bounce.y = 0;
    this.player.body.linearDamping = 1;
    this.player.body.collideWorldBounds = true;
    this.player.body.fixedRotation = true;

    //properties when the player is ducked and standing, so we can use in update()
    var playerDuckImg = this.game.cache.getImage('playerDuck');
    this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    //init game controller
    //this.initGameController();

    //sounds
    this.coinSound = this.game.add.audio('coin');
  }, 
  update: function() {

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.paquetes, this.collectPaquete, null, this);
    //collision
    //this.game.physics.arcade.collide(this.player, this.floors, this.playerHit, null, this);
    //this.game.physics.arcade.collide(this.player, this.verticalObstacles, this.playerHit, null, this);
    //this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
    
    //only respond to keys and keep the speed if the player is alive
    

    if(this.cursors.up.isDown && this.player.body.velocity.y === 0) {
      this.player.body.velocity.y = -400;
      console.log(this.player.body.velocity.y);
    }else if(this.cursors.right.isDown){
      if(direction!='right'){
        this.player.scale.x *= -1;
        direction = 'right';
      }
      console.log("Derecha");
      this.player.body.velocity.x += 5;
      this.player.animations.play('walk',30,true);
    }else if(this.cursors.left.isDown){
      if(direction!='left'){
        this.player.scale.x *= -1;
        direction = 'left';
      }
      console.log("Izquierda");
      this.player.animations.play('walk',30,true);
      this.player.body.velocity.x -= 5;
    }else{
      this.player.body.velocity.x = 0;
      this.player.animations.play('wait', 20, true);

    }

    if(this.player.alive) {

      if(this.player.body.touching.down) {
        this.player.body.velocity.x = -this.levelSpeed;  
      }
      else {
       // this.player.body.velocity.x = 0;  
      }
      

      if(this.cursors.up.isDown) {
        this.playerJump();
      }
      else if(this.cursors.down.isDown) {
        this.playerDuck();
      }

      if(!this.cursors.down.isDown && this.player.isDucked && !this.pressingDown) {
        //change image and update the body size for the physics engine
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }

      //restart the game if reaching the edge
      if(reiniciar) {
        reiniciar = false;
        this.game.state.start('Game');
      }

      if(this.player.x <= -this.tileSize) {
        this.game.state.start('Game');
      }
      if(this.player.y >= this.game.world.height + this.tileSize) {
        this.game.state.start('Game');
      }
    }

    //generate further terrain
    //this.generateTerrain();
    //this.createCoins();

  },
  generateTerrain: function(){
    var i, delta = 0, block;
    for(i = 0; i < this.floors.length; i++) {
      if(this.floors.getAt(i).body.x <= -this.tileSize) {

        if(Math.random() < this.probCliff && !this.lastCliff && !this.lastVertical) {
          delta = 1;
          this.lastCliff = true;
          this.lastVertical = false;
        }
        else if(Math.random() < this.probVertical && !this.lastCliff) {
          this.lastCliff = false;
          this.lastVertical = true;
          block = this.verticalObstacles.getFirstExists(false);
          block.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 3 * this.tileSize);
          block.body.velocity.x = this.levelSpeed;
          block.body.immovable = true;

          if(Math.random() < this.probMoreVertical) {
            block = this.verticalObstacles.getFirstExists(false);
            if(block) {
              block.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 4 * this.tileSize);
              block.body.velocity.x = this.levelSpeed;
              block.body.immovable = true;
            }            
          }

        }
        else {
          this.lastCliff = false;
          this.lastVertical = false;
        }

        this.floors.getAt(i).body.x = this.lastFloor.body.x + this.tileSize + delta * this.tileSize * 1.5;
        this.lastFloor = this.floors.getAt(i);
        break;
      }
    }
  },
  playerHit: function(player, blockedLayer) {
    //if hits on the right side, die
    if(player.body.touching.right) {

      //set to dead (this doesn't affect rendering)
      this.player.alive = false;

      //stop moving to the right
      this.player.body.velocity.x = 0;

      //change sprite image
      this.player.loadTexture('playerDead');

      //go to gameover after a few miliseconds
      this.game.time.events.add(1500, this.gameOver, this);
    }
  },
  collect: function(player, collectable) {
    //play audio
    console.log("Moneda !");
    this.coinSound.play();
    collectable.kill();
    //remove sprite
    //collectable.destroy();
  },
  collectPaquete : function(player, collectable){
    console.log("Paquete !");
    this.coinSound.play();
    var style = { font: "16px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 300};
    text = this.game.add.text(this.player.x, this.player.y-100, "Paquete entregado, Fin del juego !", style);
    text.anchor.set(0.5);
    collectable.kill();
    setTimeout(function(){
      reiniciar = true;
    },1000);
  },
  finDelJuego: function(){
    var style = { font: "16px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 300};
    text = this.game.add.text(this.player.x, this.player.y-100, "Se agoto el tiempo, Fin del juego !", style);
    text.anchor.set(0.5);
    setTimeout(function(){
      reiniciar = true;
    },1000);
  },
  initGameController: function() {

    if(!GameController.hasInitiated) {
      var that = this;
      
      GameController.init({
          right: {
              type: 'none',
          },
          left: {
              type: 'buttons',
              buttons: [
                false,
                {
                  label: 'J', 
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.playerJump();
                  }
                },
                false,
                {
                  label: 'D',
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.pressingDown = true; that.playerDuck();
                  },
                  touchEnd: function(){
                    that.pressingDown = false;
                  }
                }
              ]
          },
      });
      GameController.hasInitiated = true;
    }

  },
  //create coins
  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType('coin', this.map, 'Monedas');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },
  findObjectsByType : function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
      //console.log("Found a " + type);
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
  createFromTiledObject : function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
 
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  gameOver: function() {
    this.game.state.start('Game');
  },
  playerJump: function() {
    if(this.player.body.touching.down) {
      this.player.body.velocity.y -= 700;
    }    
  },
  playerDuck: function() {
      //change image and update the body size for the physics engine
      this.player.loadTexture('playerDuck');
      this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);
      
      //we use this to keep track whether it's ducked or not
      this.player.isDucked = true;
  },
  render: function()
    {
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
        this.game.debug.text(Math.round(this.game.time.events.duration / 1000) || '--', 80, 70, "#ffffff", "40px Courier"); 
    } 
};