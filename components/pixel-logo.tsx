"use client";

// Pixel font definitions: each letter is a 5-wide x 7-tall grid
// 1 = filled block, 0 = empty
const LETTERS: Record<string, number[][]> = {
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  D: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

const BLOCK = 6; // block size in px
const GAP = 1; // gap between blocks
const LETTER_GAP = 2; // gap between letters (in block units)

export default function PixelLogo() {
  const text = "AD ENGINE";
  const letters = text.split("").map((ch) => LETTERS[ch] || LETTERS[" "]);

  // Calculate total width
  let totalCols = 0;
  letters.forEach((grid, i) => {
    totalCols += grid[0].length;
    if (i < letters.length - 1) totalCols += LETTER_GAP;
  });

  const svgWidth = totalCols * (BLOCK + GAP);
  const svgHeight = 7 * (BLOCK + GAP);

  const blocks: Array<{ x: number; y: number }> = [];
  let offsetX = 0;

  letters.forEach((grid, li) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col]) {
          blocks.push({
            x: (offsetX + col) * (BLOCK + GAP),
            y: row * (BLOCK + GAP),
          });
        }
      }
    }
    offsetX += grid[0].length + LETTER_GAP;
    if (li < letters.length - 1) {
      // letter gap already added
    }
  });

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
    >
      <defs>
        {/* Block gradient for 3D brick effect */}
        <linearGradient id="blockFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8956A" />
          <stop offset="40%" stopColor="#D4845A" />
          <stop offset="100%" stopColor="#C07048" />
        </linearGradient>
        <linearGradient id="blockTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0A878" />
          <stop offset="100%" stopColor="#E08860" />
        </linearGradient>
      </defs>
      {blocks.map((b, i) => (
        <g key={i}>
          {/* Shadow/depth */}
          <rect
            x={b.x + 0.5}
            y={b.y + 0.5}
            width={BLOCK}
            height={BLOCK}
            rx={0.5}
            fill="#8B4A2A"
          />
          {/* Main block face */}
          <rect
            x={b.x}
            y={b.y}
            width={BLOCK}
            height={BLOCK}
            rx={0.5}
            fill="url(#blockFace)"
          />
          {/* Top highlight */}
          <rect
            x={b.x}
            y={b.y}
            width={BLOCK}
            height={BLOCK * 0.4}
            rx={0.5}
            fill="url(#blockTop)"
            opacity={0.6}
          />
          {/* Outline */}
          <rect
            x={b.x + 0.3}
            y={b.y + 0.3}
            width={BLOCK - 0.6}
            height={BLOCK - 0.6}
            rx={0.3}
            fill="none"
            stroke="#E8956A"
            strokeWidth={0.3}
            opacity={0.5}
          />
        </g>
      ))}
    </svg>
  );
}
