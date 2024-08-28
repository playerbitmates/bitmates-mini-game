// game.js

import MenuScene from './menuScene.js';
import GameScene from './gameScene.js';
import GameOverScene from './gameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: 651,
    height: 389,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    scene: [MenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
