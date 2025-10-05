const canvas = document.getElementById("meteorCanvas");
const ctx = canvas.getContext("2d");
let meteors = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Meteor {
  constructor() {
    this.reset();
  }

  reset() {
    const sidebar = document.querySelector("aside");
    const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;

    this.x = sidebarWidth + Math.random() * (canvas.width - sidebarWidth);
    this.y = -20; // start slightly above canvas
    this.length = 40 + Math.random() * 80; // shorter streaks
    this.speedY = 0.5 + Math.random() * 1.5; // much slower fall
    this.opacity = 1;
    this.fadeStart = Math.random() * canvas.height * 0.7; // random fade trigger point
  }

  update() {
    this.y += this.speedY;

    // start fading when past fadeStart
    if (this.y > this.fadeStart) {
      this.opacity -= 0.01; // fade slower
    }

    // reset if fully faded or out of screen
    if (this.opacity <= 0 || this.y - this.length > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.length);
    gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1; // thinner streak
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y - this.length);
    ctx.stroke();
    ctx.restore();
  }
}

function createMeteors(count) {
  for (let i = 0; i < count; i++) {
    meteors.push(new Meteor());
  }
}

createMeteors(20); // number of meteors
animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  meteors.forEach(meteor => {
    meteor.update();
    meteor.draw();
  });
  requestAnimationFrame(animate);
}
