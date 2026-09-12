import React, { useEffect, useRef } from 'react';

export default function OrbitGlobe({ label = "AURA" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timer = null;

    const tryInit = () => {
      if (typeof window.initOrbitGlobe === 'function') {
        // Remove any prior canvas or children created previously to guarantee only 1 canvas
        const canvases = el.querySelectorAll('canvas');
        if (canvases.length > 0) {
          canvases.forEach((c) => c.remove());
        }
        el.__orbit_inited = false;
        window.initOrbitGlobe(el);
      } else {
        // retry after small tick until orbit.js finishes loading
        timer = setTimeout(tryInit, 60);
      }
    };

    tryInit();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full max-w-[580px] aspect-square mx-auto">
      {/* Intense Background Cyber Atmosphere Glow */}
      <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-blue-600/35 via-cyan-500/25 to-indigo-600/35 blur-3xl opacity-90 pointer-events-none" />

      {/* Single Three.js Globe Container */}
      <div 
        ref={containerRef} 
        data-orbit-globe 
        aria-hidden="true" 
        className="relative z-10 w-full h-[520px] select-none"
      >
        <span className="orbit-center-text">{label}</span>
        <span className="orbit-center-sub">INTELLIGENCE</span>
      </div>
    </div>
  );
}
