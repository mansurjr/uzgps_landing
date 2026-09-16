"use client";

import { useEffect, type RefObject } from "react";
import { animate, stagger } from "animejs";

/**
 * Staggered fade-up for every [data-reveal] inside `root` the first time it enters the viewport.
 * Elements in the same batch share one stagger, so rows cascade instead of popping together.
 * Targets mounted later (tab switches, conditional blocks) are picked up too — otherwise the
 * `.js [data-reveal] { opacity: 0 }` rule would leave them invisible.
 */
export function useReveal(root: RefObject<HTMLElement | null>, opts: { y?: number; step?: number } = {}) {
  const { y = 28, step = 70 } = opts;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = new WeakSet<Element>();

    const io = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
            if (!batch.length) return;
            batch.forEach((t) => io!.unobserve(t));
            animate(batch, {
              opacity: [0, 1],
              translateY: [y, 0],
              duration: 1000,
              delay: stagger(step),
              ease: "outExpo",
            });
          },
          { rootMargin: "0px 0px -12% 0px" },
        );

    const track = (node: ParentNode) => {
      const found = [
        ...(node instanceof HTMLElement && node.matches("[data-reveal]") ? [node] : []),
        ...Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]")),
      ];
      for (const t of found) {
        if (seen.has(t)) continue;
        seen.add(t);
        // with reduced motion the CSS media query already shows targets, so only observe when animating
        io?.observe(t);
      }
    };

    track(el);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof HTMLElement && track(n));
    });
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, [root, y, step]);
}
