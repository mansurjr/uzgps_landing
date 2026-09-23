// Decorative illustrations for the cloud / on-premise comparison in Solutions.

const CLOUD =
  "M6.657 18C4.085 18 2 15.993 2 13.517s2.085-4.482 4.657-4.482c.393-1.762 1.794-3.2 3.675-3.773c1.88-.572 3.956-.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486s-1.551 3.487-3.465 3.487H6.657";
const TRUCK =
  "M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 17H3V6a1 1 0 0 1 1-1h9v12m-4 0h6m4 0h2v-6h-8m0-5h5l3 5";
const LAPTOP = "M3 19h18M5 7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z";
const PHONE = "M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm5-1h2m-1 13v.01";
const LOCK =
  "M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm6 3a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  vectorEffect: "non-scaling-stroke",
} as const;

function Node({ x, y, d }: { x: number; y: number; d: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="21" className="fill-navy-2" stroke="currentColor" strokeOpacity="0.35" />
      <path d={d} {...stroke} strokeWidth={1.6} transform="translate(-10 -10) scale(0.84)" />
    </g>
  );
}

export function CloudArt() {
  const nodes = [
    { x: 56, d: TRUCK },
    { x: 160, d: LAPTOP },
    { x: 264, d: PHONE },
  ];
  return (
    <svg viewBox="0 0 320 170" className="h-auto w-full max-w-90 text-paper" aria-hidden>
      {nodes.map((n) => (
        <path
          key={n.x}
          d={`M160 64 C160 100 ${n.x} 108 ${n.x} 127`}
          fill="none"
          className="deploy-flow stroke-primary"
          strokeWidth="1.5"
        />
      ))}
      <g className="text-primary" transform="translate(112 -8) scale(4)">
        <path d={CLOUD} {...stroke} strokeWidth={2.2} className="fill-primary/10" />
      </g>
      <circle cx="146" cy="46" r="3" className="deploy-blink fill-primary" />
      <circle cx="160" cy="46" r="3" className="deploy-blink fill-primary [animation-delay:.3s]" />
      <circle cx="174" cy="46" r="3" className="deploy-blink fill-primary [animation-delay:.6s]" />
      {nodes.map((n) => (
        <Node key={n.x} x={n.x} y={148} d={n.d} />
      ))}
    </svg>
  );
}

export function ServerArt() {
  const units = [44, 80, 116];
  return (
    <svg viewBox="0 0 320 170" className="h-auto w-full max-w-90 text-navy" aria-hidden>
      {/* organisation perimeter */}
      <rect x="40" y="24" width="240" height="140" rx="6" fill="none" className="stroke-rule-strong" strokeDasharray="5 5" />
      {units.map((y, i) => (
        <g key={y}>
          <rect x="100" y={y} width="120" height="28" rx="4" className="fill-white" stroke="currentColor" strokeWidth="2" />
          <circle cx="116" cy={y + 14} r="3.5" className={`fill-ok deploy-blink ${i === 1 ? "[animation-delay:.5s]" : ""}`} />
          <circle cx="128" cy={y + 14} r="3.5" className="fill-primary" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${170 + k * 10} ${y + 8}v12`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
          ))}
        </g>
      ))}
      {/* lock badge on the perimeter */}
      <g transform="translate(258 2)">
        <circle cx="22" cy="22" r="20" className="fill-navy" />
        <path d={LOCK} {...stroke} className="text-paper" transform="translate(12 12) scale(0.84)" />
      </g>
    </svg>
  );
}
