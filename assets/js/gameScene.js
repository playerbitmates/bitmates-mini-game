class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.zombieSpeed = 100; // Variável para ajustar a velocidade dos zumbis
        this.maxHealth = 1000; // Vida máxima do jogador
        this.currentHealth = this.maxHealth; // Vida atual do jogador
        this.lastCoinPosition = null; // Última posição da moeda coletada
        this.coinCount = 0; // Contador de moedas
        this.zombieCount = 0; // Contador de zumbis adicionados
    }

    init(data) {
        this.bitmateId = data.bitmateId;
    }

    preload() {
        const dynamicSkinUrl = `https://storage.googleapis.com/apes-f984d.appspot.com/Isometric/${this.bitmateId}`;
        this.load.spritesheet('player', dynamicSkinUrl, {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.image('background', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/background.png');

        this.load.spritesheet('zombie', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/zombie.png', {
            frameWidth: 300,
            frameHeight: 275
        });

        this.load.spritesheet('coin', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/coinRotating.png', {
            frameWidth: 16,
            frameHeight: 16
        }); // Carregar spritesheet da moeda

        
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        // this.cameras.main.backgroundColor.setTo(27, 65, 25);
        this.cameras.main.backgroundColor.setTo(147, 89, 63);

        this.createPlayerAnimations();
        this.createZombieAnimations();
        this.createCoinAnimation();

        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1.5);
        this.cameras.main.startFollow(this.player);

        // Adicionando a barra de vida acima do jogador
        this.healthBar = this.add.graphics();
        this.updateHealthBar();

        this.zombies = [];
        this.addZombie(300, 300);

                // Adicionar moeda
                this.addCoin();

                // Adicionar contador de moedas
                this.coinText = this.add.text(16, 16, 'Coins: 0', { fontSize: '20px', fill: '#ffffff' });
                this.coinText.setScrollFactor(0); // Fixar o texto na tela
        

        this.cursors = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });

        
    }

    createCoinAnimation() {
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }

    addCoin() {
        let coinX, coinY;
    
        do {
            coinX = Phaser.Math.Between(50, this.cameras.main.width - 50);
            coinY = Phaser.Math.Between(50, this.cameras.main.height - 50);
        } while (this.lastCoinPosition && Phaser.Math.Distance.Between(coinX, coinY, this.lastCoinPosition.x, this.lastCoinPosition.y) < 50 || 
                 Phaser.Math.Distance.Between(coinX, coinY, this.player.x, this.player.y) < 50); // Garantir que a moeda não apareça perto do jogador
    
        const newCoinPosition = { x: coinX, y: coinY };
    
        this.coin = this.physics.add.sprite(coinX, coinY, 'coin').play('rotate');
        this.coin.setScale(1.5); // Ajuste o tamanho da moeda
        this.physics.add.overlap(this.player, this.coin, this.collectCoin, null, this);
        this.lastCoinPosition = newCoinPosition; // Atualizar a última posição da moeda
    }
    

    // collectCoin(player, coin) {
    //     coin.destroy(); // Remover a moeda coletada
    //     this.coinCount += 1; // Incrementar o contador de moedas
    //     this.coinText.setText('Coins: ' + this.coinCount); // Atualizar o texto do contador de moedas
    //     this.addCoin(); // Adicionar uma nova moeda em posição diferente
    //     console.log('Moeda coletada!');
    //     // Adicione a lógica para aumentar a pontuação, vida ou outra funcionalidade
    // }

    collectCoin(player, coin) {
        coin.destroy();
        this.coinCount += 1;
        this.coinText.setText('Coins: ' + this.coinCount);

        // Adicionar novo zumbi a cada 20 moedas
        if (this.coinCount % 2 === 0) {
            this.addZombie(Phaser.Math.Between(50, this.cameras.main.width - 50), Phaser.Math.Between(50, this.cameras.main.height - 50));
        }
        
        this.addCoin();
        console.log('Moeda coletada!');
    }

    createPlayerAnimations() {
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down-right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up-right',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up-left',
            frames: this.anims.generateFrameNumbers('player', { start: 40, end: 47 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 48, end: 55 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down-left',
            frames: this.anims.generateFrameNumbers('player', { start: 56, end: 63 }),
            frameRate: 10,
            repeat: -1
        });
    }

    createZombieAnimations() {
        this.anims.create({
            key: 'zombie-up',
            frames: this.anims.generateFrameNumbers('zombie', { start: 9, end: 16 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie-down',
            frames: this.anims.generateFrameNumbers('zombie', { start: 17, end: 24 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie-up-left',
            frames: this.anims.generateFrameNumbers('zombie', { start: 53, end: 60 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie-up-right',
            frames: this.anims.generateFrameNumbers('zombie', { start: 81, end: 86 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie-down-left',
            frames: this.anims.generateFrameNumbers('zombie', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie-down-right',
            frames: this.anims.generateFrameNumbers('zombie', { start: 31, end: 34 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'zombie-attack-up',
            frames: this.anims.generateFrameNumbers('zombie', { start: 9, end: 16 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'zombie-attack-down',
            frames: this.anims.generateFrameNumbers('zombie', { start: 11, end: 20 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'zombie-attack-left',
            frames: this.anims.generateFrameNumbers('zombie', { start: 61, end: 71 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'zombie-attack-right',
            frames: this.anims.generateFrameNumbers('zombie', { start: 83, end: 90 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'zombie-attack-up-left',
            frames: this.anims.generateFrameNumbers('zombie', { start: 61, end: 71 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'zombie-attack-up-right',
            frames: this.anims.generateFrameNumbers('zombie', { start: 24, end: 31 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'zombie-attack-down-left',
            frames: this.anims.generateFrameNumbers('zombie', { start: 48, end: 55 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'zombie-attack-down-right',
            frames: this.anims.generateFrameNumbers('zombie', { start: 45, end: 50 }),
            frameRate: 10
        });
    }

    addZombie(x, y) {
        const zombie = this.physics.add.sprite(x, y, 'zombie').play('zombie-down');
        zombie.setCollideWorldBounds(true);
        zombie.setScale(0.32);
        zombie.isAttacking = false; // Flag para verificar se o zumbi está atacando
        zombie.attackTime = 0; // Tempo do ataque
        this.zombies.push(zombie);

        this.physics.add.overlap(this.player, zombie, this.handleOverlap, null, this);
    }

    update() {
        let anim = '';
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.w.isDown || this.cursors.up.isDown) {
            if (this.cursors.a.isDown || this.cursors.left.isDown) {
                anim = 'up-left';
                velocityX = -160;
                velocityY = -160;
            } else if (this.cursors.d.isDown || this.cursors.right.isDown) {
                anim = 'up-right';
                velocityX = 160;
                velocityY = -160;
            } else {
                anim = 'up';
                velocityY = -160;
            }
        } else if (this.cursors.s.isDown || this.cursors.down.isDown) {
            if (this.cursors.a.isDown || this.cursors.left.isDown) {
                anim = 'down-left';
                velocityX = -160;
                velocityY = 160;
            } else if (this.cursors.d.isDown || this.cursors.right.isDown) {
                anim = 'down-right';
                velocityX = 160;
                velocityY = 160;
            } else {
                anim = 'down';
                velocityY = 160;
            }
        } else if (this.cursors.a.isDown || this.cursors.left.isDown) {
            anim = 'left';
            velocityX = -160;
        } else if (this.cursors.d.isDown || this.cursors.right.isDown) {
            anim = 'right';
            velocityX = 160;
        }

        if (anim !== '') {
            this.player.setVelocityX(velocityX);
            this.player.setVelocityY(velocityY);
            this.player.anims.play(anim, true);
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.stop();
        }

        this.zombies.forEach((zombie) => {
            const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, this.player.x, this.player.y);
            const distance = Phaser.Math.Distance.Between(zombie.x, zombie.y, this.player.x, this.player.y);

            let repulsionX = 0;
            let repulsionY = 0;

            this.zombies.forEach(otherZombie => {
                if (otherZombie !== zombie) {
                    const dist = Phaser.Math.Distance.Between(zombie.x, zombie.y, otherZombie.x, otherZombie.y);
                    if (dist < 50) {
                        const angleToOther = Phaser.Math.Angle.Between(zombie.x, zombie.y, otherZombie.x, otherZombie.y);
                        const strength = 200 / dist;
                        repulsionX += Math.cos(angleToOther) * strength;
                        repulsionY += Math.sin(angleToOther) * strength;
                    }
                }
            });

            if (distance < 20) {
                if (!zombie.isAttacking) {
                    zombie.setVelocity(0);
                    const dx = this.player.x - zombie.x;
                    const dy = this.player.y - zombie.y;

                    if (Math.abs(dx) > Math.abs(dy)) {
                        if (dx > 0) {
                            zombie.anims.play('zombie-attack-right', true);
                            zombie.attackTime = 500; // Definir o tempo de ataque
                        } else {
                            zombie.anims.play('zombie-attack-left', true);
                            zombie.attackTime = 500;
                        }
                    } else {
                        if (dy > 0) {
                            zombie.anims.play('zombie-attack-down', true);
                            zombie.attackTime = 500;
                        } else {
                            zombie.anims.play('zombie-attack-up', true);
                            zombie.attackTime = 500;
                        }
                    }
                    zombie.isAttacking = true;
                }
            } else {
                zombie.setVelocityX((this.zombieSpeed + repulsionX) * Math.cos(angle));
                zombie.setVelocityY((this.zombieSpeed + repulsionY) * Math.sin(angle));

                if (zombie.body.velocity.x < 0 && zombie.body.velocity.y < 0) {
                    zombie.anims.play('zombie-up-left', true);
                } else if (zombie.body.velocity.x > 0 && zombie.body.velocity.y < 0) {
                    zombie.anims.play('zombie-up-right', true);
                } else if (zombie.body.velocity.x < 0 && zombie.body.velocity.y > 0) {
                    zombie.anims.play('zombie-down-left', true);
                } else if (zombie.body.velocity.x > 0 && zombie.body.velocity.y > 0) {
                    zombie.anims.play('zombie-down-right', true);
                } else if (zombie.body.velocity.x < 0) {
                    zombie.anims.play('zombie-left', true);
                } else if (zombie.body.velocity.x > 0) {
                    zombie.anims.play('zombie-right', true);
                } else if (zombie.body.velocity.y < 0) {
                    zombie.anims.play('zombie-up', true);
                } else if (zombie.body.velocity.y > 0) {
                    zombie.anims.play('zombie-down', true);
                }
                zombie.isAttacking = false;
            }

            if (zombie.isAttacking) {
                zombie.attackTime -= this.game.loop.delta;
                if (zombie.attackTime <= 0) {
                    zombie.isAttacking = false;
                }
            }
        });

        // Atualizar a posição da barra de vida
        this.healthBar.x = this.player.x;
        this.healthBar.y = this.player.y - 40;
        this.updateHealthBar();
    }

    updateHealthBar() {
        this.healthBar.clear();
        
        // Desenhar a borda preta
        this.healthBar.lineStyle(2, 0x000000); // Borda preta com espessura de 2 pixels
        this.healthBar.strokeRect(-this.player.displayWidth / 2 - 2, -30 - 2, this.player.displayWidth + 4, 14); // Aumenta o tamanho da borda em relação à barra
    
        // Desenhar o fundo branco da barra de vida
        this.healthBar.fillStyle(0xffffff); // Branco
        this.healthBar.fillRect(-this.player.displayWidth / 2, -30, this.player.displayWidth, 10);
    
        // Determinar a cor da barra com base na vida restante
        let healthPercentage = this.currentHealth / this.maxHealth;
        let color;
    
        if (healthPercentage > 0.6) {
            color = 0x00ff00; // Verde
        } else if (healthPercentage > 0.25) {
            color = 0xffff00; // Amarelo
        } else {
            color = 0xff0000; // Vermelho
        }
    
        // Desenhar a barra de vida com a cor apropriada
        this.healthBar.fillStyle(color);
        this.healthBar.fillRect(-this.player.displayWidth / 2, -30, (this.currentHealth / this.maxHealth) * this.player.displayWidth, 10);
    }
    
    
    

    handleOverlap(player, zombie) {
        if (zombie.isAttacking) {
            this.currentHealth -= 1; // Reduz 1 ponto da vida do jogador
            if (this.currentHealth <= 0) {
                this.currentHealth = 0;
                console.log('Game Over');
                // Adicione lógica para game over, se necessário
                // Aqui você pode parar a cena atual e iniciar a cena do menu
                
                this.scene.stop('GameScene'); // Parar a cena atual
                this.currentHealth = 1000
                this.scene.start('GameOverScene', { coinCount: this.coinCount });

            }
            this.updateHealthBar();
        }
    }
}

export default GameScene;
