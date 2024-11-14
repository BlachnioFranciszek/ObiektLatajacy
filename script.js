class MovingObject {
    constructor(element) {
        this.element = element;
        this.x = 0;
        this.y = 0;
        this.interval = null;
        this.keysPressed = {};
        this.init();
    }

    init() {
        window.addEventListener('keydown', (event) => this.startMoving(event));
        window.addEventListener('keyup', (event) => this.stopMoving(event));
        this.interval = setInterval(() => this.updatePosition(), 3);  
    }

    startMoving(event) {
        this.keysPressed[event.key] = true;
    }

    stopMoving(event) {
        delete this.keysPressed[event.key];
    }

    updatePosition() {
        const playerRect = this.element.getBoundingClientRect();
        
        if (this.keysPressed['ArrowUp'] && this.y > 0 && !this.isColliding(playerRect, 'up')) this.y -= 1;
        if (this.keysPressed['ArrowDown'] && this.y < window.innerHeight - playerRect.height && !this.isColliding(playerRect, 'down')) this.y += 1;
        if (this.keysPressed['ArrowLeft'] && this.x > 0 && !this.isColliding(playerRect, 'left')) this.x -= 1;
        if (this.keysPressed['ArrowRight'] && this.x < window.innerWidth - playerRect.width && !this.isColliding(playerRect, 'right')) this.x += 1;

        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    isColliding(rect, direction) {
        const trees = document.querySelectorAll('.tree');
        for (const tree of trees) {
            const treeRect = tree.getBoundingClientRect();
            if (direction === 'up' && rect.top - 1 < treeRect.bottom && rect.bottom > treeRect.top && rect.left < treeRect.right && rect.right > treeRect.left) {
                return true;
            }
            if (direction === 'down' && rect.bottom + 1 > treeRect.top && rect.top < treeRect.bottom && rect.left < treeRect.right && rect.right > treeRect.left) {
                return true;
            }
            if (direction === 'left' && rect.left - 1 < treeRect.right && rect.right > treeRect.left && rect.top < treeRect.bottom && rect.bottom > treeRect.top) {
                return true;
            }
            if (direction === 'right' && rect.right + 1 > treeRect.left && rect.left < treeRect.right && rect.top < treeRect.bottom && rect.bottom > treeRect.top) {
                return true;
            }
        }
        return false;
    }
}
class Enemy {
    constructor(player, speed = 1, color = 'blue') {
        this.player = player;
        this.element = this.createEnemy(color);
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.speed = 1;
        this.interval = setInterval(() => this.moveTowardsPlayer(), 12 / speed);
    }

    createEnemy(color) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.backgroundColor = color;
        document.body.appendChild(enemy);
        return enemy;
    }

    moveTowardsPlayer() {
        const playerRect = this.player.element.getBoundingClientRect();
        const enemyRect = this.element.getBoundingClientRect();

        const dx = playerRect.left - enemyRect.left;
        const dy = playerRect.top - enemyRect.top;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 500) { // Only move towards player if within 500px
            if (distance < this.speed) {
                this.element.style.transform = `translate(${playerRect.left}px, ${playerRect.top}px)`;
            } else {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
                this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
            }

            if (this.isTouchingPlayer(playerRect, enemyRect)) {
                this.removePlayer();
            }
        }
    }

    isTouchingPlayer(playerRect, enemyRect) {
        return !(
            playerRect.right < enemyRect.left ||
            playerRect.left > enemyRect.right ||
            playerRect.bottom < enemyRect.top ||
            playerRect.top > enemyRect.bottom
        );
    }

    removePlayer() {
        this.player.element.remove();
        alert("Game Over!");
        clearInterval(this.interval);
    }
}


function spawnTrees() {
    const numTrees = Math.floor(window.innerWidth * window.innerHeight / 200000);
    for (let i = 0; i < numTrees; i++) {
        const treeContainer = document.createElement('div');
        treeContainer.className = 'tree-container';
        treeContainer.style.position = 'absolute';
        treeContainer.style.left = `${Math.random() * (window.innerWidth - 120)}px`;  
        treeContainer.style.top = `${Math.random() * (window.innerHeight - 120)}px`;

        // Main tree (center)
        const treeCenter = document.createElement('div');
        treeCenter.className = 'tree';
        treeCenter.style.position = 'absolute';
        treeCenter.style.width = '30px';
        treeCenter.style.height = '30px';
        treeCenter.style.backgroundColor = 'green';
        treeCenter.style.left = '30px';
        treeCenter.style.top = '30px';
        treeContainer.appendChild(treeCenter);

        // Top part of the plus
        const treeTop = document.createElement('div');
        treeTop.className = 'tree';
        treeTop.style.position = 'absolute';
        treeTop.style.width = '30px';
        treeTop.style.height = '30px';
        treeTop.style.backgroundColor = 'green';
        treeTop.style.left = '30px';
        treeTop.style.top = '0px';
        treeContainer.appendChild(treeTop);

        // Bottom part of the plus
        const treeBottom = document.createElement('div');
        treeBottom.className = 'tree';
        treeBottom.style.position = 'absolute';
        treeBottom.style.width = '30px';
        treeBottom.style.height = '30px';
        treeBottom.style.backgroundColor = 'green';
        treeBottom.style.left = '30px';
        treeBottom.style.top = '60px';
        treeContainer.appendChild(treeBottom);

        // Left part of the plus
        const treeLeft = document.createElement('div');
        treeLeft.className = 'tree';
        treeLeft.style.position = 'absolute';
        treeLeft.style.width = '30px';
        treeLeft.style.height = '30px';
        treeLeft.style.backgroundColor = 'green';
        treeLeft.style.left = '0px';
        treeLeft.style.top = '30px';
        treeContainer.appendChild(treeLeft);

        // Right part of the plus
        const treeRight = document.createElement('div');
        treeRight.className = 'tree';
        treeRight.style.position = 'absolute';
        treeRight.style.width = '30px';
        treeRight.style.height = '30px';
        treeRight.style.backgroundColor = 'green';
        treeRight.style.left = '60px';
        treeRight.style.top = '30px';
        treeContainer.appendChild(treeRight);

        document.body.appendChild(treeContainer);
    }
}




document.addEventListener('DOMContentLoaded', () => {
    const player = new MovingObject(document.getElementById('object'));
    spawnTrees();  
    setInterval(() => new Enemy(player), 5000); 
    setInterval(() => new Enemy(player, 2, 'pink'), 20000); 
});
