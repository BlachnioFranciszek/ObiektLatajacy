class MovingObject {
    constructor(element) {
        this.element = element;
        this.x = 0;
        this.y = 12;
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
        const speed = 1;
        const diagonalSpeed = speed / Math.sqrt(2);
   
        if (this.keysPressed['ArrowUp'] && this.keysPressed['ArrowLeft'] && this.y > speed+0 && this.x > speed+0 && !this.isColliding(playerRect, 'up') && !this.isColliding(playerRect, 'left')) {
            this.y -= diagonalSpeed;
            this.x -= diagonalSpeed;
        } else if (this.keysPressed['ArrowUp'] && this.keysPressed['ArrowRight'] && this.y > speed+0 && this.x < window.innerWidth - playerRect.width * 1.2 && !this.isColliding(playerRect, 'up') && !this.isColliding(playerRect, 'right')) {
            this.y -= diagonalSpeed;
            this.x += diagonalSpeed;
        } else if (this.keysPressed['ArrowDown'] && this.keysPressed['ArrowLeft'] && this.y < window.innerHeight - playerRect.height * 1.2 && this.x > speed+0 && !this.isColliding(playerRect, 'down') && !this.isColliding(playerRect, 'left')) {
            this.y += diagonalSpeed;
            this.x -= diagonalSpeed;
        } else if (this.keysPressed['ArrowDown'] && this.keysPressed['ArrowRight'] && this.y < window.innerHeight - playerRect.height * 1.2 && this.x < window.innerWidth - playerRect.width * 1.2 && !this.isColliding(playerRect, 'down') && !this.isColliding(playerRect, 'right')) {
            this.y += diagonalSpeed;
            this.x += diagonalSpeed;
        } else {
            if (this.keysPressed['ArrowUp'] && this.y > 0+speed && !this.isColliding(playerRect, 'up')) this.y -= speed;
            if (this.keysPressed['ArrowDown'] && this.y < window.innerHeight - playerRect.height * 1.2 && !this.isColliding(playerRect, 'down')) this.y += speed;
            if (this.keysPressed['ArrowLeft'] && this.x > 0+speed && !this.isColliding(playerRect, 'left')) this.x -= speed;
            if (this.keysPressed['ArrowRight'] && this.x < window.innerWidth - playerRect.width * 1.2 && !this.isColliding(playerRect, 'right')) this.x += speed;
        }
   
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
        this.x = Math.random() * window.innerWidth * 0.9;
        this.y = Math.random() * window.innerHeight * 0.9;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.speed = 1;
        this.interval = setInterval(() => this.moveTowardsPlayer(), 12 / speed);
        this.seen=false
    }
 
    createEnemy(color) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.backgroundColor = color;
        if (color === 'pink') {
            enemy.style.width = '40px';
            enemy.style.height = '40px';
        }
        document.body.appendChild(enemy);
        return enemy;
    }
 
    moveTowardsPlayer() {
        const playerRect = this.player.element.getBoundingClientRect();
        const enemyRect = this.element.getBoundingClientRect();
 
        const dx = playerRect.left - enemyRect.left;
        const dy = playerRect.top - enemyRect.top;
 
        const distance = Math.sqrt(dx * dx + dy * dy);
 
        if (distance < 500 || (this.seen==true && distance<+Math.random()*100+50)) {
            this.seen=true
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
        else if (distance>500+Math.random()*100+50)
        {
            this.seen=false
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
 
 
        const treeCenter = document.createElement('div');
        treeCenter.className = 'tree';
        treeCenter.style.position = 'absolute';
        treeCenter.style.width = '30px';
        treeCenter.style.height = '30px';
        treeCenter.style.backgroundColor = 'green';
        treeCenter.style.left = '30px';
        treeCenter.style.top = '30px';
        treeContainer.appendChild(treeCenter);
 
     
        const treeTop = document.createElement('div');
        treeTop.className = 'tree';
        treeTop.style.position = 'absolute';
        treeTop.style.width = '30px';
        treeTop.style.height = '30px';
        treeTop.style.backgroundColor = 'green';
        treeTop.style.left = '30px';
        treeTop.style.top = '0px';
        treeContainer.appendChild(treeTop);
 
   
        const treeBottom = document.createElement('div');
        treeBottom.className = 'tree';
        treeBottom.style.position = 'absolute';
        treeBottom.style.width = '30px';
        treeBottom.style.height = '30px';
        treeBottom.style.backgroundColor = 'green';
        treeBottom.style.left = '30px';
        treeBottom.style.top = '60px';
        treeContainer.appendChild(treeBottom);
 
   
        const treeLeft = document.createElement('div');
        treeLeft.className = 'tree';
        treeLeft.style.position = 'absolute';
        treeLeft.style.width = '30px';
        treeLeft.style.height = '30px';
        treeLeft.style.backgroundColor = 'green';
        treeLeft.style.left = '0px';
        treeLeft.style.top = '30px';
        treeContainer.appendChild(treeLeft);
 
     
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
 
 
var started = false
 
window.addEventListener("load", () => {
    const button = document.getElementById("enterFullscreen");
 
    button.addEventListener("click", () => {
        if (started == false) {
 
 
            started = true
            window.addEventListener("wheel", (event) => {
                if (event.ctrlKey) {
                    event.preventDefault();
                }
            }, { passive: false });
 
            let countdown = 3;
            document.documentElement.requestFullscreen()
            button.innerText = countdown;
 
            const countdownInterval = setInterval(() => {
                countdown -= 1;
                if (countdown > 0) {
                    button.innerText = countdown;
                } else {
                    clearInterval(countdownInterval);
                    button.style.display = "none";
                    var pobj=document.createElement('div');
                    pobj.id="object"
                    const player = new MovingObject(pobj);
                    document.body.appendChild(pobj)
                    spawnTrees();
                    setInterval(() => new Enemy(player), 4000);
                    setInterval(() => new Enemy(player, 2, 'pink'), 17000);
                }
            }, 1000);
        }
    });
});
