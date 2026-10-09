/**
 * Orhan Ambient Light Dust & Warm Golden Bokeh Engine
 * Ultra-smooth 60fps subtle ambient light particles tailored for Apple UI Light Aesthetics.
 * Completely glitch-free, hardware-accelerated, and non-distracting.
 */

class EmberCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 38;
    this.mouse = { x: -1000, y: -1000, radius: 100 };
    this.animationFrame = null;
    this.width = 0;
    this.height = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    }, { passive: true });

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }

    this.render = this.render.bind(this);
    this.render();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * (window.devicePixelRatio > 1 ? 1.5 : 1);
    this.canvas.height = this.height * (window.devicePixelRatio > 1 ? 1.5 : 1);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    const scale = window.devicePixelRatio > 1 ? 1.5 : 1;
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  createParticle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20,
      size: Math.random() * 3.5 + 1.2,
      vy: -(Math.random() * 0.6 + 0.3),
      vx: (Math.random() - 0.5) * 0.4,
      life: Math.random() * 0.7 + 0.3,
      decay: Math.random() * 0.003 + 0.0015,
      hue: Math.floor(Math.random() * 24) + 24, // 24-48: Warm amber / apricot gold
      opacity: Math.random() * 0.18 + 0.08,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01
    };
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.wobble += p.wobbleSpeed;
      p.x += Math.sin(p.wobble) * 0.4 + p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      // Soft mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.mouse.radius && dist > 0) {
        const force = (1 - dist / this.mouse.radius) * 1.2;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }

      if (p.life > 0) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        const alpha = Math.min(p.life, p.opacity);
        this.ctx.fillStyle = `hsla(${p.hue}, 90%, 55%, ${alpha})`;
        this.ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha * 0.6})`;
        this.ctx.shadowBlur = p.size * 2;
        this.ctx.fill();
        this.ctx.restore();
      }

      if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > this.width + 20) {
        this.particles[i] = this.createParticle(false);
      }
    }

    this.animationFrame = requestAnimationFrame(this.render);
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

window.EmberCanvasEngine = EmberCanvasEngine;
