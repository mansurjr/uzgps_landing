"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

// Adapted from React Bits Radar: https://www.reactbits.dev/backgrounds/radar
const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

#define TAU 6.28318530718

void main() {
  vec2 point = (gl_FragCoord.xy - uResolution * 0.5) / uResolution.y * 2.0;

  float distanceFromCenter = length(point);
  float angle = atan(point.y, point.x);
  float ringPhase = distanceFromCenter * 5.5;
  float rings = 1.0 - smoothstep(0.0, 0.025, abs(fract(ringPhase) - 0.5));
  float spokeAngle = abs(fract(angle * 12.0 / TAU + 0.5) - 0.5) * TAU / 12.0;
  float spokes = (1.0 - smoothstep(0.0, 0.004, spokeAngle * distanceFromCenter))
    * smoothstep(0.06, 0.2, distanceFromCenter);

  float sweepAngle = mod(angle + uTime * 0.24 - TAU * 0.5 + TAU * 2.0, TAU);
  float sweep = pow(1.0 - sweepAngle / TAU, 6.0);
  float beam = 1.0 - smoothstep(0.0, 0.035, sweepAngle);
  float fade = 1.0 - smoothstep(0.8, 1.75, distanceFromCenter);
  float signal = (rings * 0.13 + spokes * 0.08 + sweep * 0.11 + beam * 0.25) * fade;

  vec3 navy = vec3(0.039, 0.102, 0.188);
  vec3 cyan = vec3(0.0, 0.678, 0.925);
  vec3 color = navy + cyan * signal;
  gl_FragColor = vec4(color, 1.0);
}
`;

export default function HeroBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: new Float32Array([1, 1]) },
        uTime: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    let lastRender = 0;
    let elapsed = 0;

    const render = () => renderer.render({ scene: mesh });
    const canAnimate = () => visible && !document.hidden && !reducedMotion.matches;
    const tick = (now: number) => {
      frame = 0;
      if (!canAnimate()) return;
      if (now - lastRender >= 1000 / 30) {
        elapsed += Math.min((now - lastRender) / 1000, 0.1);
        program.uniforms.uTime.value = elapsed;
        render();
        lastRender = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const syncAnimation = () => {
      if (canAnimate() && !frame) {
        lastRender = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!canAnimate() && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      render();
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });

    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", syncAnimation);
    reducedMotion.addEventListener("change", syncAnimation);
    resize();
    syncAnimation();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      reducedMotion.removeEventListener("change", syncAnimation);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={containerRef} className="size-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#0a1a30_85%)] opacity-65" />
    </div>
  );
}
