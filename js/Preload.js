var SideScroller = SideScroller || {};

//loading the game assets
SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.image('player', 'assets/images/player.png');
    this.load.image('playerDuck', 'assets/images/player_duck.png');
    this.load.image('playerDead', 'assets/images/player_dead.png');
    this.load.spritesheet('coin', 'assets/images/coin.png',32, 32);
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('yellowBlock', 'assets/images/yellow-block.png');
    this.load.image('paquete', 'assets/images/paquete.png');
    this.load.image('fondo', 'assets/images/LogoOscuro.png');
    this.load.spritesheet('menRun', 'assets/images/metalslug_mummy37x45.png', 37, 45, 18);
    //this.load.spritesheet('menRun', 'assets/images/MenRun.png', 47.6, 92);

    //this.load.tilemap('map', 'assets/maps/mapa.json', null, Phaser.Tilemap.TILED_JSON);
    //this.load.image('tiles', 'assets/images/kenney.png');
    //this.load.image('goldCoin', 'assets/images/goldCoin.png');

    this.load.tilemap('map', 'assets/maps/features_test.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('ground_1x1', 'assets/images/ground_1x1.png');
    this.load.image('walls_1x2', 'assets/images/walls_1x2.png');
    this.load.image('tiles2', 'assets/images/tiles2.png');
    //this.load.tilemap('map', 'assets/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    //this.load.image('tiles', 'assets/maps/super_mario.png');

    this.load.audio('coin', 'assets/audio/coin.wav');
  },
  create: function() {
    this.state.start('Game');
  }
};