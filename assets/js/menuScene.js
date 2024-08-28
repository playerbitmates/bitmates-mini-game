class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Carregar a spritesheet para a animação do fundo
        this.load.spritesheet('menuBackground', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/menu.png', {
            frameWidth: 800, // Largura de cada quadro
            frameHeight: 400 // Altura de cada quadro
        });

        // Carregar a imagem para o fundo do campo de entrada
        this.load.image('inputBackground', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/menuBg.png');

        // Carregar o logo
        this.load.image('logo', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/logo.png');

        // Carregar a imagem do botão
        this.load.image('buttonImage', 'https://raw.githubusercontent.com/playerbitmates/bitmates-mini-game/main/assets/img/button.png');
    }
    

    create() {
        // Criar uma animação com a spritesheet
        this.anims.create({
            key: 'menuAnim', // Nome da animação
            frames: this.anims.generateFrameNumbers('menuBackground', { start: 0, end: 65 - 1 }), // X é o número de quadros
            frameRate: 10, // Número de quadros por segundo
            repeat: -1 // Repetir infinitamente
        });

        // Adicionar o sprite animado ao fundo da cena
        const bg = this.add.sprite(0, 0, 'menuBackground').setOrigin(0, 0);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Ajusta a imagem para cobrir a tela toda
        bg.play('menuAnim'); // Inicia a animação

        // Adicionar o logo um pouco acima do texto de instrução
        this.logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'logo');
        this.logo.setOrigin(0.5, 0.5);
        this.logo.setScale(1); // Ajuste o tamanho inicial do logo, se necessário

        // Adicionar interatividade para o efeito de hover
        this.logo.setInteractive();

        // Aplicar o efeito de zoom no logo quando o mouse passa sobre ele
        this.logo.on('pointerover', () => {
            this.tweens.add({
                targets: this.logo,
                scale: 1.1, // Aumenta o logo em 10%
                duration: 300, // Duração da animação em milissegundos
                ease: 'Power2', // Tipo de easing
            });
        });

        // Restaurar o tamanho original do logo quando o mouse sai
        this.logo.on('pointerout', () => {
            this.tweens.add({
                targets: this.logo,
                scale: 1, // Retorna ao tamanho original
                duration: 300,
                ease: 'Power2',
            });
        });

        // Adicionar o texto de instrução com borda marrom escura
        const style = { 
            font: '24px Arial', 
            fill: '#995750', 
            stroke: '#4d2d2f', // Cor da borda (marrom escuro)
            strokeThickness: 4, // Espessura da borda
            align: 'center' 
        };
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Enter Bitmates ID:', style)
            .setOrigin(0.5, 0.5);

        // Adicionar a imagem de fundo para a área de entrada
        const inputBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'inputBackground');
        inputBg.setDisplaySize(200, 40); // Ajustar o tamanho da imagem para o tamanho desejado do campo de entrada
        inputBg.setOrigin(0.5, 0.5);

        // Adicionar o texto para o campo de entrada com placeholder
        this.inputField = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Enter ID...', {
            font: '24px Arial',
            fill: '#888888', // Cor do placeholder
            align: 'center'
        })
        .setOrigin(0.5, 0.5)
        .setAlpha(0.5); // Transparência para o placeholder

        // Adicionar o botão Play com imagem de fundo
        this.playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'buttonImage')
            .setDisplaySize(120, 40) // Reduzir o tamanho do botão para metade do tamanho original
            .setOrigin(0.5, 0.5)
            .setInteractive();

        // Adicionar o texto sobre o botão
        this.playButtonText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'Play', {
            font: '20px Arial',
            fill: '#ffffff',
            padding: { x: 20, y: 10 },
            stroke: '#0056b3',
            strokeThickness: 4,
            align: 'center'
        })
        .setOrigin(0.5, 0.5);

        // Adicionar efeitos de interatividade ao botão (sem efeito de hover ou transparência)
        this.playButton.on('pointerdown', () => this.startGame());

        // Variável para armazenar o ID digitado
        this.enteredId = '';

        // Adicionar evento de clique para iniciar o processo de entrada
        this.input.on('pointerdown', () => this.showKeyboard());
    }

    showKeyboard() {
        // Cria uma entrada de texto temporária
        const keyboard = document.createElement('input');
        keyboard.type = 'text';
        keyboard.maxLength = 4; // Limitar o comprimento do texto a 4 caracteres
        keyboard.style.position = 'absolute';
        keyboard.style.left = '-1000px'; // Ocultar o campo de entrada
        document.body.appendChild(keyboard);

        // Sempre que o campo de entrada é clicado, limpe o campo
        keyboard.addEventListener('focus', () => {
            this.enteredId = ''; // Limpa o ID atual
            this.updateInputField(); // Atualiza a exibição do campo de entrada
        });

        keyboard.focus();
        keyboard.addEventListener('input', () => {
            this.enteredId = keyboard.value;
            this.updateInputField();
        });

        keyboard.addEventListener('blur', () => {
            document.body.removeChild(keyboard);
        });
    }

    updateInputField() {
        // Atualiza o texto da área de entrada com o ID digitado
        if (this.enteredId) {
            this.inputField.setText(this.enteredId);
            this.inputField.setAlpha(1); // Torna o texto visível se houver texto
        } else {
            this.inputField.setText('Enter ID...'); // Placeholder
            this.inputField.setAlpha(0.5); // Torna o placeholder visível quando não há texto
        }
        this.updatePlayButton(); // Atualiza o botão de acordo com a validade do ID
    }

    updatePlayButton() {
        if (this.isValidId(this.enteredId)) {
            this.playButtonText.setTint(0x00ff00); // Verde para ID válido
        } else {
            this.playButtonText.setTint(0xff0000); // Vermelho para ID inválido
        }
    }

    isValidId(id) {
        // Verifica se o ID é exatamente '0' ou se é um número entre 1 e 9999 sem zeros à esquerda
        return id === '0' || /^[1-9][0-9]{0,3}$/.test(id);
    }

    startGame() {
        if (this.isValidId(this.enteredId)) {
            // Passar o ID para a cena do jogo
            this.scene.start('GameScene', { bitmateId: this.enteredId });
        }
    }
    

    update() {}
}

export default MenuScene;
