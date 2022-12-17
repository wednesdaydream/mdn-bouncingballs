// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//设置段落
const para = document.querySelector('p');
let count = 0;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

// 构造器 Shape (用来定义恶魔圈 EvilCircle())
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX; //水平速度
  this.velY = velY; //竖直速度
  this.exists = exists; //用来标记球是否存在于程序中（布尔型 true/false）
}

// 构造器 Ball (继承 Shape)
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists); //继承
  
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// Ball()的方法
  //画小球 draw()
  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  //更新小球状态的函数 update()
  Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;

  }

  //碰撞检测 collisionDetect()
  Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (this !== balls[j]) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance =Math.sqrt(dx * dx + dy * dy);
      

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = randomColor();
        }
      }
    }
  }

// 构造器 EvilCircle() （继承Shape）
function EvilCircle(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, 20, 20, exists);

  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// EvilCircle()的方法
  //draw()
  EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  //checkBounds()
  EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
      this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }

  //setControls()
  EvilCircle.prototype.setControls = function() {
    window.onkeydown = e => {
      switch(e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    };  
  }

  //collisionDetect()
  EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (balls[j].exists === true) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
      
  
        if (distance < this.size + balls[j].size) {
          balls[j].exists = false;
          count--;
          para.textContent = '剩余彩球数：' + count; 
        }
      }
    }
  }

//创建恶魔圈对象实例
let evil = new EvilCircle(
  random(0, width),
  random(0, height),
  true,
);
evil.setControls(); 

//让小球动起来
  //首先在一个地方存储小球
  let balls = [];

  while (balls.length < 30) {
    let size = random(10, 20);
    let ball = new Ball(
      // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      true,
      randomColor(),
      size
    );
    balls.push(ball);
    count++;
    para.textContent = '剩余彩球数：' + count;
  }

  //几乎所有的动画效果都会用到一个运动循环，也就是每一帧都自动更新视图。
  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
      if (balls[i].exists === true) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
      }
    }

    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    requestAnimationFrame(loop);

  }

  loop(); 






