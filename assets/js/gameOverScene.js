class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    preload() {
        this.load.image('gameOverBackground', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/gameOver.png');
        this.load.image('buttonImage', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/button.png');
        this.load.spritesheet('playerDeath', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/playerDeath.png', {
            frameWidth: 640,
            frameHeight: 710
        });
    }

    create(data) {
        const { coinCount = 0 } = data; // Garantir que coinCount tenha um valor padrão de 0

        const bg = this.add.image(0, 0, 'gameOverBackground').setOrigin(0, 0);
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        const gameOverStyle = {
            font: 'bold 64px Arial',
            fill: '#ff0000',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 10
        };
        const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'GAME OVER', gameOverStyle)
            .setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: gameOverText,
            alpha: { from: 1, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.menuButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 120, 'buttonImage')
            .setDisplaySize(160, 40)
            .setOrigin(0.5, 0.5)
            .setInteractive();

        const menuButtonText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 120, 'Menu', {
            font: '24px Arial',
            fill: '#ffffff',
            padding: { x: 20, y: 10 },
            stroke: '#4d2d2f',
            strokeThickness: 4,
            align: 'center'
        })
        .setOrigin(0.5, 0.5);

        this.menuButton.on('pointerdown', () => this.startMenu());
        this.menuButton.on('pointerover', () => {
            this.menuButton.setAlpha(0.8);
        });
        this.menuButton.on('pointerout', () => {
            this.menuButton.setAlpha(1);
        });

        this.anims.create({
            key: 'playerDeathAnim',
            frames: this.anims.generateFrameNumbers('playerDeath', { start: 0, end: 30 }),
            frameRate: 10,
            repeat: 0
        });
        
        this.playerDeathSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 70, 'playerDeath').play('playerDeathAnim');
        this.playerDeathSprite.setOrigin(0.5, 0.5);
        this.playerDeathSprite.setScale(0.5);

        this.playerDeathSprite.on('animationcomplete-playerDeathAnim', () => {
            this.playerDeathSprite.setVisible(false);

            const coinTextStyle = {
                font: '32px Arial',
                fill: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 5
            };
            const coinText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Coins: ' + coinCount, coinTextStyle)
                .setOrigin(0.5, 0.5);
        });
    }

    startMenu() {
        this.scene.start('GameOverScene'); 
        this.scene.start('MenuScene'); 
        window.location.reload();
    }
}


export default GameOverScene;
