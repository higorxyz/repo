import { useEffect } from 'react';

export const useParticleBackground = (canvasRef, theme) => {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId;
    const particles = [];
    const trailParticles = [];
    const ripples = [];
    const mouse = { x: null, y: null, radius: 180 };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.density = (Math.random() * 30) + 1;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -1;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -1;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        this.pulsePhase += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.8;

        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);

            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;

            this.size = this.baseSize + force * 2;
            this.opacity = Math.min(1, this.opacity + force * 0.3);
          } else {
            this.opacity = Math.max(0.3, this.opacity - 0.01);
          }
        }
      }

      draw() {
        const isLightTheme = theme === 'light';
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );

        if (isLightTheme) {
          gradient.addColorStop(0, `rgba(109, 40, 217, ${this.opacity})`);
          gradient.addColorStop(0.5, `rgba(124, 58, 237, ${this.opacity * 0.9})`);
          gradient.addColorStop(1, `rgba(147, 51, 234, ${this.opacity * 0.5})`);
        } else {
          gradient.addColorStop(0, `rgba(192, 132, 252, ${this.opacity})`);
          gradient.addColorStop(0.5, `rgba(168, 85, 247, ${this.opacity * 0.7})`);
          gradient.addColorStop(1, `rgba(124, 58, 237, ${this.opacity * 0.2})`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.size > 2) {
          ctx.strokeStyle = theme === 'light'
            ? `rgba(109, 40, 217, ${this.opacity * 0.7})`
            : `rgba(192, 132, 252, ${this.opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size + 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    class TrailParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.opacity = 1;
        this.decay = 0.02;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.decay;
        this.size *= 0.97;
      }

      draw() {
        const isLightTheme = theme === 'light';
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );

        if (isLightTheme) {
          gradient.addColorStop(0, `rgba(168, 85, 247, ${this.opacity * 0.6})`);
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        } else {
          gradient.addColorStop(0, `rgba(192, 132, 252, ${this.opacity})`);
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 150;
        this.speed = 4;
        this.opacity = 1;
      }

      update() {
        this.radius += this.speed;
        this.opacity = 1 - (this.radius / this.maxRadius);
      }

      draw() {
        const isLightTheme = theme === 'light';

        ctx.strokeStyle = isLightTheme
          ? `rgba(124, 58, 237, ${this.opacity * 0.5})`
          : `rgba(168, 85, 247, ${this.opacity * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = isLightTheme
          ? `rgba(168, 85, 247, ${this.opacity * 0.7})`
          : `rgba(192, 132, 252, ${this.opacity})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const particleCount = window.innerWidth < 768 ? 25 : 40;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      const isLightTheme = theme === 'light';
      const maxDistance = 140;
      const maxConnections = 3;

      for (let i = 0; i < particles.length; i += 1) {
        let connections = 0;
        for (let j = i + 1; j < particles.length && connections < maxConnections; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            connections += 1;
            const opacity = (1 - distance / maxDistance) * 0.3;

            ctx.strokeStyle = isLightTheme
              ? `rgba(109, 40, 217, ${opacity * 0.5})`
              : `rgba(168, 85, 247, ${opacity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let lastMouseMove = Date.now();
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;

      const now = Date.now();
      const isMobile = window.innerWidth < 768;
      const maxTrail = isMobile ? 20 : 35;
      const particlesPerMove = isMobile ? 1 : 2;

      if (now - lastMouseMove > 50 && trailParticles.length < maxTrail) {
        for (let i = 0; i < particlesPerMove; i += 1) {
          trailParticles.push(new TrailParticle(event.x, event.y));
        }
        lastMouseMove = now;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleClick = (event) => {
      ripples.push(new Ripple(event.x, event.y));

      const clickParticles = window.innerWidth < 768 ? 8 : 12;
      for (let i = 0; i < clickParticles; i += 1) {
        trailParticles.push(new TrailParticle(event.x, event.y));
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    const targetFPS = window.innerWidth < 768 ? 30 : 60;
    const frameDelay = 1000 / targetFPS;
    let lastFrameTime = 0;

    const animate = (currentTime = 0) => {
      if (currentTime - lastFrameTime < frameDelay) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();

      for (let i = trailParticles.length - 1; i >= 0; i -= 1) {
        trailParticles[i].update();
        trailParticles[i].draw();
        if (trailParticles[i].opacity <= 0) {
          trailParticles.splice(i, 1);
        }
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].radius >= ripples[i].maxRadius) {
          ripples.splice(i, 1);
        }
      }

      if (mouse.x != null && mouse.y != null && theme !== 'light') {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius
        );

        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
        gradient.addColorStop(0.5, 'rgba(192, 132, 252, 0.06)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, theme]);
};
