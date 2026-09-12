import React, { useEffect, useRef } from 'react';

export default function PolygonBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const COLOR = '37, 100, 232'; // electric blue rgb
    const ACCENT_COLOR = '56, 189, 248'; // cyan rgb
    const COUNT = 38;
    const LINK_DIST = 260;
    let W, H;
    let dots = [];
    let animId = null;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < COUNT; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.5 + 1.2
      });
    }

    const step = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
      }

      // Connecting lines & subtle filled triangles
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dAB = Math.hypot(dx, dy);
          if (dAB >= LINK_DIST) continue;

          const lineAlpha = (1 - dAB / LINK_DIST) * 0.28;
          ctx.strokeStyle = `rgba(${COLOR}, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          for (let k = j + 1; k < dots.length; k++) {
            const c = dots[k];
            const dAC = Math.hypot(a.x - c.x, a.y - c.y);
            if (dAC >= LINK_DIST) continue;
            const dBC = Math.hypot(b.x - c.x, b.y - c.y);
            if (dBC >= LINK_DIST) continue;

            const triAlpha = (1 - (dAB + dAC + dBC) / (LINK_DIST * 3)) * 0.06;
            if (triAlpha > 0) {
              ctx.fillStyle = `rgba(${ACCENT_COLOR}, ${triAlpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.lineTo(c.x, c.y);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      }

      // Render glowing dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        ctx.fillStyle = `rgba(${ACCENT_COLOR}, 0.85)`;
        ctx.shadowColor = `rgba(${ACCENT_COLOR}, 0.9)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-45"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
