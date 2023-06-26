/** @param {InnerHTML}*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

console.log(ctx);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineWidth = 1;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.angle = 0;
    this.speedX;
    this.speedY;
    this.speedModifier = Math.floor(Math.random() * 3 + 1);
    this.history = [{ x: this.x, y: this.y }];
    this.maxLength = Math.floor(Math.random() * 200 + 100);
    this.timer = this.maxLength * 2;
  }

  draw(context) {
    // context.fillRect(this.x, this.y, 10, 10);
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.stroke();
  }

  update() {
    this.timer--;
    if (this.timer >= 1) {
      let x = Math.floor(this.x / this.effect.cellSize);
      let y = Math.floor(this.y / this.effect.cellSize);
      let index = y * this.effect.columns + x;
      this.angle = this.effect.flowField[index];

      this.speedX = Math.cos(this.angle);
      this.speedY = Math.sin(this.angle);
      this.x += this.speedX * this.speedModifier;
      this.y += this.speedY * this.speedModifier;

      // this.angle += 0.5;
      // this.x += this.speedX + Math.sin(this.angle) * 10;
      // this.y += this.speedY * Math.cos(this.angle) * 7;
      this.history.push({ x: this.x, y: this.y });

      if (this.history.length > this.maxLength) {
        this.history.shift();
      }
    } else if (this.history.length > 1) {
      this.history.shift();
    } else {
      this.reset();
    }
  }

  reset() {
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [{ x: this.x, y: this.y }];
    this.timer = this.maxLength * 2;
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 1500;
    this.zoom = 0.11;
    this.cellSize = 30;
    this.rows;
    this.columns;
    this.flowField = [];
    this.init();
  }

  init() {
    this.rows = Math.floor(this.height / this.cellSize);
    this.columns = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * 1.6;
        this.flowField.push(angle);
      }
    }
    console.log(this.flowField);

    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  drawGrid(context) {
    context.save();
    context.lineWidth = 1;

    for (let col = 0; col < this.columns; col++) {
      context.beginPath();
      context.moveTo(this.cellSize * col, 0);
      context.lineTo(this.cellSize * col, this.height);
      context.stroke();
    }
    for (let row = 0; row < this.rows; row++) {
      context.beginPath();
      context.moveTo(0, this.cellSize * row);
      context.lineTo(this.width, this.cellSize * row);
      context.stroke();
    }
  }

  render(context) {
    this.drawGrid(context);
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

const effect = new Effect(canvas.width, canvas.height);

effect.render(ctx);

console.log(effect);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}

animate();
